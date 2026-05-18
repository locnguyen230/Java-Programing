import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Loader2,
  AlertCircle,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import SearchFilters from "../../components/job-search/SearchFilters";
import JobCard from "../../components/job-search/JobCard";
import Pagination from "../../components/job-search/Pagination";
import { useSearchStore } from "../../store/useSearchStore";
import { useAuthStore } from "../../store/useAuthStore";
import {
  searchJobs,
  getTrendingJobs,
  getTrendingKeywords,
  getRecentSearches,
  saveJob,
  unsaveJob,
  getSearchSuggestions,
} from "../../services/jobService";
import { connectJobRealtime } from "../../services/realtime";

function debounceFn<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  delayMs: number
) {
  let timer: number | undefined;

  return (...args: TArgs) => {
    if (timer) window.clearTimeout(timer);
    return new Promise<TResult>((resolve, reject) => {
      timer = window.setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, delayMs);
    });
  };
}

export default function JobSearch() {
  const {
    filters,
    setFilters,
    jobs,
    setJobs,
    page,
    setPage,
    totalPages,
    setPaginationInfo,
    loading,
    setLoading,
    error,
    setError,
    recentSearches,
    setRecentSearches,
    trendingKeywords,
    setTrendingKeywords,
    resetFilters,
  } = useSearchStore();

  const { user } = useAuthStore();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showRecentTrending, setShowRecentTrending] = useState(true);

  // Fetch trending data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [trending, keywords, recent] = await Promise.all([
          getTrendingJobs(),
          getTrendingKeywords(),
          user ? getRecentSearches() : Promise.resolve([]),
        ]);

        setJobs(trending);
        setTrendingKeywords(keywords);
        if (user) {
          setRecentSearches(recent);
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };

    loadInitialData();
  }, [user, setJobs, setTrendingKeywords, setRecentSearches]);

  const hasResults = jobs.length > 0;
  const isSearching = filters.keyword || Object.values(filters).some((v) => v);

  // Real-time updates: when an employer publishes a job, refresh instantly
  useEffect(() => {
    // Guard: if browser has no WS support, keep REST-only mode.
    if (typeof WebSocket === "undefined") return;

    let disconnect: (() => void) | null = null;

    try {
      const realtime = connectJobRealtime(async (event) => {
        if (event.type !== "JOB_PUBLISHED") return;

        try {
          if (isSearching) {
            const result = await searchJobs({ ...filters, page: 0 });
            setJobs(result.content);
            setPaginationInfo(
              result.page,
              result.size,
              result.totalPages,
              result.totalElements
            );
          } else {
            // When not searching, candidates should still see newly published jobs.
            // Refresh with a general search (no keyword filters) instead of relying on "trending"
            // (which may not include the brand-new job yet).
            const result = await searchJobs({
              ...filters,
              keyword: "",
              page: 0,
            });

            setJobs(result.content);
            setPaginationInfo(
              result.page,
              result.size,
              result.totalPages,
              result.totalElements
            );

            // Keep trending keywords in sync (optional UX)
            const keywords = await getTrendingKeywords();
            setTrendingKeywords(keywords);
          }
        } catch {
          // ignore; REST UI will still work
        }
      });

      disconnect = realtime.disconnect;
    } catch (e) {
      // If realtime init fails, do not break rendering.
      disconnect = null;
    }

    return () => {
      if (disconnect) disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching, filters, setJobs, setPaginationInfo, setTrendingKeywords]);

  // Debounced search function
  const performSearch = useCallback(
    debounceFn(async (searchFilters: any) => {
      try {
        setLoading(true);
        setError(null);

        const result = await searchJobs(searchFilters);
        setJobs(result.content);
        setPaginationInfo(
          result.page,
          result.size,
          result.totalPages,
          result.totalElements
        );
        setShowRecentTrending(false);

        // Save to search history
        if (user && searchFilters.keyword) {
          try {
            const recent = await getRecentSearches();
            setRecentSearches(recent);
          } catch (err) {
            console.warn("Failed to update search history", err);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to search jobs");
        toast.error("Failed to search jobs");
      } finally {
        setLoading(false);
      }
    }, 500),
    [
      user,
      setLoading,
      setError,
      setJobs,
      setPaginationInfo,
      setRecentSearches,
      setShowRecentTrending,
    ]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setFilters({ ...filters, keyword, page: 0 });
    setPage(0);

    // Get suggestions if keyword is not empty
    if (keyword.length > 0 && user) {
      const fetchSuggestions = async () => {
        try {
          const results = await getSearchSuggestions(keyword);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (err) {
          console.warn("Failed to fetch suggestions", err);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    if (keyword || Object.values(filters).some((v) => v && v !== keyword)) {
      performSearch({ ...filters, keyword, page: 0 });
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: any) => {
    setFilters({ ...newFilters, page: 0 });
    setPage(0);
    performSearch({ ...newFilters, page: 0 });
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      performSearch({ ...filters, page: newPage });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    resetFilters();
    setShowRecentTrending(true);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle save job toggle
  const handleSaveToggle = async (jobId: string, isSaved: boolean) => {
    try {
      if (isSaved) {
        await unsaveJob(jobId);
      } else {
        await saveJob(jobId);
      }
      // Update local state
      const updatedJobs = jobs.map((job) =>
        job.id === jobId ? { ...job, isSaved } : job
      );
      setJobs(updatedJobs);
    } catch (err) {
      toast.error("Failed to save job");
      throw err;
    }
  };

  // Handle suggestion/keyword click
  const handleKeywordClick = (keyword: string) => {
    setFilters({ ...filters, keyword, page: 0 });
    setPage(0);
    performSearch({ ...filters, keyword, page: 0 });
    setSuggestions([]);
    setShowSuggestions(false);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8">
      {/* Hero Search Bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12 px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-emerald-100 mb-6">
            Explore thousands of job opportunities from top companies
          </p>

          {/* Search Input */}
          <div className="relative">
            <div className="flex items-center bg-white rounded-lg overflow-hidden">
              <Search className="ml-4 text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Search by job title, skills, company..."
                value={filters.keyword || ""}
                onChange={handleSearchChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
              />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10"
              >
                {suggestions.slice(0, 5).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleKeywordClick(suggestion)}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-emerald-50 transition first:rounded-t-lg last:rounded-b-lg"
                  >
                    <Search size={16} className="inline mr-2 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Trending Keywords - Show when no search */}
          {!isSearching && trendingKeywords.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={18} />
                <span className="font-semibold">Trending searches:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingKeywords.slice(0, 6).map((keyword, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleKeywordClick(keyword)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full transition"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <SearchFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClear={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Recent Searches - Show initially */}
            {showRecentTrending && recentSearches.length > 0 && user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={20} className="text-blue-600" />
                  <h2 className="text-lg font-bold">Your Recent Searches</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0, 6).map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleKeywordClick(search)}
                      className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Results Header */}
            {isSearching && (
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Job Opportunities
                  </h2>
                  {hasResults && (
                    <p className="text-gray-600 mt-1">
                      Found <span className="font-semibold">{totalPages * 10}</span> results
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Searching jobs...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-3"
              >
                <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-semibold text-red-900">Error</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              </motion.div>
            )}

            {/* No Results */}
            {isSearching && !loading && !hasResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}

            {/* Jobs Grid */}
            {hasResults && !loading && (
              <>
                <div className="grid gap-4 mb-8">
                  {jobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <JobCard
                        job={job}
                        onSaveToggle={handleSaveToggle}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    disabled={loading}
                  />
                )}
              </>
            )}

            {/* Trending Jobs - Show initially */}
            {showRecentTrending && !isSearching && jobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={24} className="text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Trending Jobs
                  </h2>
                </div>
                <div className="grid gap-4">
                  {jobs.slice(0, 6).map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <JobCard
                        job={job}
                        onSaveToggle={handleSaveToggle}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
