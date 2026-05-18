import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SearchFiltersProps {
  filters: {
    location?: string;
    minSalary?: number;
    maxSalary?: number;
    experience?: string;
    employmentType?: string;
    skills?: string;
  };
  onFiltersChange: (filters: any) => void;
  onClear: () => void;
}

const EXPERIENCE_OPTIONS = [
  { value: "FRESHER", label: "Fresher (Entry-level)" },
  { value: "JUNIOR", label: "Junior (1-2 years)" },
  { value: "MID", label: "Mid (3-5 years)" },
  { value: "SENIOR", label: "Senior (5+ years)" },
];

const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "REMOTE", label: "Remote" },
  { value: "CONTRACT", label: "Contract" },
];

const LOCATION_OPTIONS = [
  "Hanoi",
  "Ho Chi Minh City",
  "Da Nang",
  "Remote",
  "Other",
];

const SKILLS_OPTIONS = [
  "Java",
  "React",
  "Spring Boot",
  "Python",
  "AI",
  "Machine Learning",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Node.js",
  "Angular",
  "Vue",
  "SQL",
  "MongoDB",
  "TypeScript",
  "DevOps",
];

export default function SearchFilters({
  filters,
  onFiltersChange,
  onClear,
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["salary", "location"])
  );

  const toggleSection = (section: string) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    setExpandedSections(newSet);
  };

  const handleInputChange = (key: string, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleMultiSelect = (key: string, value: string) => {
    const currentValue = filters[key as keyof typeof filters] || "";
    const values = currentValue ? currentValue.toString().split(",") : [];
    
    if (values.includes(value)) {
      const updated = values.filter((v) => v !== value).join(",");
      handleInputChange(key, updated);
    } else {
      const updated = [...values, value].join(",");
      handleInputChange(key, updated);
    }
  };

  const hasActiveFilters =
    filters.location ||
    filters.minSalary ||
    filters.maxSalary ||
    filters.experience ||
    filters.employmentType ||
    filters.skills;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="w-full mb-4 px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
        >
          <X size={18} />
          Clear All Filters
        </button>
      )}

      {/* Salary Range */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("salary")}
          className="flex items-center justify-between w-full mb-3 font-semibold text-gray-800 hover:text-emerald-600 transition"
        >
          <span>💰 Salary Range</span>
          <ChevronDown
            size={20}
            className={`transition ${expandedSections.has("salary") ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {expandedSections.has("salary") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Min: {filters.minSalary ? `${filters.minSalary / 1000000}M` : "Any"} VND
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="500000"
                  value={filters.minSalary || 0}
                  onChange={(e) =>
                    handleInputChange("minSalary", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Max: {filters.maxSalary ? `${filters.maxSalary / 1000000}M` : "Any"} VND
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000000"
                  step="500000"
                  value={filters.maxSalary || 10000000}
                  onChange={(e) =>
                    handleInputChange("maxSalary", parseInt(e.target.value))
                  }
                  className="w-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Location */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("location")}
          className="flex items-center justify-between w-full mb-3 font-semibold text-gray-800 hover:text-emerald-600 transition"
        >
          <span>📍 Location</span>
          <ChevronDown
            size={20}
            className={`transition ${expandedSections.has("location") ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {expandedSections.has("location") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {LOCATION_OPTIONS.map((location) => (
                <label
                  key={location}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.location === location}
                    onChange={() => handleInputChange("location", location)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-emerald-600 transition">
                    {location}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Experience Level */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("experience")}
          className="flex items-center justify-between w-full mb-3 font-semibold text-gray-800 hover:text-emerald-600 transition"
        >
          <span>🎯 Experience</span>
          <ChevronDown
            size={20}
            className={`transition ${expandedSections.has("experience") ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {expandedSections.has("experience") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {EXPERIENCE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.experience === option.value}
                    onChange={() =>
                      handleInputChange("experience", option.value)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-emerald-600 transition">
                    {option.label}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Employment Type */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("employment")}
          className="flex items-center justify-between w-full mb-3 font-semibold text-gray-800 hover:text-emerald-600 transition"
        >
          <span>💼 Employment Type</span>
          <ChevronDown
            size={20}
            className={`transition ${expandedSections.has("employment") ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {expandedSections.has("employment") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={
                      filters.employmentType &&
                      filters.employmentType.includes(option.value)
                    }
                    onChange={() =>
                      handleMultiSelect("employmentType", option.value)
                    }
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-emerald-600 transition">
                    {option.label}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection("skills")}
          className="flex items-center justify-between w-full mb-3 font-semibold text-gray-800 hover:text-emerald-600 transition"
        >
          <span>⚡ Skills</span>
          <ChevronDown
            size={20}
            className={`transition ${expandedSections.has("skills") ? "rotate-180" : ""}`}
          />
        </button>

        <AnimatePresence>
          {expandedSections.has("skills") && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2"
            >
              {SKILLS_OPTIONS.map((skill) => (
                <label
                  key={skill}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={
                      filters.skills &&
                      filters.skills.split(",").includes(skill)
                    }
                    onChange={() => handleMultiSelect("skills", skill)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-emerald-600 transition">
                    {skill}
                  </span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
