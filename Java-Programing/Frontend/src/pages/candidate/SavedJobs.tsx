import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle, Bookmark, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import JobCard from "../../components/job-search/JobCard";
import Pagination from "../../components/job-search/Pagination";
import { useAuthStore } from "../../store/useAuthStore";
import { getSavedJobs, unsaveJob, Job } from "../../services/jobService";

export default function SavedJobs() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getSavedJobs(page, 10);
        setJobs(result.content);
        setTotalPages(result.totalPages);
      } catch (err: any) {
        setError(err.message || "Failed to fetch saved jobs");
        toast.error("Failed to fetch saved jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [page, user, navigate]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleUnsave = async (jobId: string) => {
    try {
      await unsaveJob(jobId);
      setJobs(jobs.filter((job) => job.id !== jobId));
      toast.success("Job removed from saved");
    } catch (err) {
      toast.error("Failed to remove job");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/jobs")}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Job Search
          </button>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
            <Bookmark size={32} className="text-emerald-600" />
            Saved Jobs
          </h1>
          <p className="text-gray-600 mt-2">
            {jobs.length} saved job{jobs.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading saved jobs...</p>
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

        {/* Empty State */}
        {!loading && !error && jobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white rounded-lg shadow-md"
          >
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No saved jobs yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring and save jobs to review later
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Browse Jobs
            </button>
          </motion.div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && jobs.length > 0 && (
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
                    job={{ ...job, isSaved: true }}
                    onSaveToggle={async (jobId) => {
                      await handleUnsave(jobId);
                    }}
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
      </div>
    </div>
  );
}
