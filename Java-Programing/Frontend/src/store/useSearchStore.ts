import { create } from "zustand";
import { JobSearchParams, Job } from "../services/jobService";

interface SearchState {
  // Search filters
  filters: JobSearchParams;
  setFilters: (filters: JobSearchParams) => void;

  // Search results
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;

  // Pagination
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setPaginationInfo: (page: number, size: number, totalPages: number, totalElements: number) => void;

  // Loading & Error
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Recent searches
  recentSearches: string[];
  setRecentSearches: (searches: string[]) => void;

  // Trending keywords
  trendingKeywords: string[];
  setTrendingKeywords: (keywords: string[]) => void;

  // Saved jobs
  savedJobIds: Set<string>;
  toggleSaveJob: (jobId: string) => void;
  setSavedJobIds: (ids: Set<string>) => void;

  // Reset filters
  resetFilters: () => void;
}

const defaultFilters: JobSearchParams = {
  keyword: "",
  location: "",
  minSalary: undefined,
  maxSalary: undefined,
  experience: "",
  employmentType: "",
  skills: "",
  companyName: "",
  page: 0,
  size: 10,
  sortBy: "createdAt",
  sortOrder: "DESC",
};

export const useSearchStore = create<SearchState>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) => set({ filters }),

  jobs: [],
  setJobs: (jobs) => set({ jobs }),

  page: 0,
  size: 10,
  totalPages: 0,
  totalElements: 0,
  setPage: (page) => set({ page }),
  setSize: (size) => set({ size }),
  setPaginationInfo: (page, size, totalPages, totalElements) =>
    set({ page, size, totalPages, totalElements }),

  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),

  recentSearches: [],
  setRecentSearches: (searches) => set({ recentSearches: searches }),

  trendingKeywords: [],
  setTrendingKeywords: (keywords) => set({ trendingKeywords: keywords }),

  savedJobIds: new Set(),
  toggleSaveJob: (jobId) =>
    set((state) => {
      const newSet = new Set(state.savedJobIds);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return { savedJobIds: newSet };
    }),
  setSavedJobIds: (ids) => set({ savedJobIds: ids }),

  resetFilters: () =>
    set({
      filters: defaultFilters,
      page: 0,
      jobs: [],
      error: null,
    }),
}));
