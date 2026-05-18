import React, { useState } from "react";
import { Bookmark, BookmarkCheck, MapPin, Briefcase, DollarSign, Eye, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Job } from "../../services/jobService";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useSearchStore } from "../../store/useSearchStore";
import { toast } from "sonner";

interface JobCardProps {
  job: Job;
  onSaveToggle?: (jobId: string, isSaved: boolean) => Promise<void>;
}

export default function JobCard({ job, onSaveToggle }: JobCardProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { savedJobIds } = useSearchStore();
  const [isSaving, setIsSaving] = useState(false);
  const isSaved = job.isSaved || savedJobIds.has(job.id);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }

    try {
      setIsSaving(true);
      if (onSaveToggle) {
        await onSaveToggle(job.id, !isSaved);
      }
      toast.success(isSaved ? "Job removed from saved" : "Job saved successfully");
    } catch (error) {
      toast.error("Failed to save job");
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/jobs/${job.id}`);
  };

  const salaryDisplay = job.minSalary
    ? `${(job.minSalary / 1000000).toFixed(1)}M - ${(job.maxSalary / 1000000).toFixed(1)}M ${job.salaryUnit}`
    : "Negotiable";

  const skills = job.skills ? job.skills.split(",").slice(0, 3) : [];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      {/* VIP Badge */}
      {job.company?.name && (
        <div className="absolute top-3 right-3">
          {job.employmentType === "REMOTE" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
              <Zap size={12} />
              Remote
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        {/* Company & Title */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            {job.company && (
              <div className="flex items-center gap-2 mb-2">
                {job.company.logoUrl && (
                  <img
                    src={job.company.logoUrl}
                    alt={job.company.name}
                    className="w-10 h-10 rounded object-contain bg-gray-100"
                  />
                )}
                <span className="text-xs text-gray-500">{job.company.name}</span>
              </div>
            )}
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-emerald-600 transition">
              {job.title}
            </h3>
          </div>
          <button
            onClick={handleSaveToggle}
            disabled={isSaving}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            {isSaved ? (
              <BookmarkCheck size={20} className="text-emerald-600" />
            ) : (
              <Bookmark size={20} className="text-gray-400" />
            )}
          </button>
        </div>

        {/* Key Info */}
        <div className="flex flex-wrap gap-3 mb-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <DollarSign size={16} className="text-emerald-600" />
            <span className="font-semibold">{salaryDisplay}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin size={16} className="text-blue-600" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Briefcase size={16} className="text-orange-600" />
            <span className="capitalize">{job.experience?.toLowerCase().replace(/_/g, " ")}</span>
          </div>
        </div>

        {/* Description preview */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {job.description}
        </p>

        {/* Skills Tags */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
              >
                {skill.trim()}
              </span>
            ))}
            {job.skills && job.skills.split(",").length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded">
                +{job.skills.split(",").length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{job.viewCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{job.applicantCount || 0}</span>
            </div>
          </div>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
