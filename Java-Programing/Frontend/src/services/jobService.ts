import api from "./api";

export interface JobSearchParams {
  keyword?: string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  experience?: string;
  employmentType?: string;
  skills?: string;
  companyName?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  minSalary: number;
  maxSalary: number;
  salaryUnit: string;
  location: string;
  experience: string;
  employmentType: string;
  skills: string;
  createdAt: string;
  deadline: string;
  viewCount: number;
  applicantCount: number;
  company: {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
  };
  isSaved: boolean;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const getJobs = async () => {
  const res = await api.get("/jobs");
  return res.data;
};

export const getJobById = async (id: string) => {
  const res = await api.get(`/jobs/${id}`);
  return res.data;
};

export const searchJobs = async (params: JobSearchParams) => {
  const res = await api.get<any>("/jobs/search/advanced", { params });
  return res.data.data as PageResponse<Job>;
};

export const getTrendingJobs = async () => {
  const res = await api.get<any>("/jobs/trending/list");
  return res.data.data as Job[];
};

export const getTrendingKeywords = async () => {
  const res = await api.get<any>("/jobs/search/trending");
  return res.data.data as string[];
};

export const getSearchSuggestions = async (prefix: string) => {
  const res = await api.get<any>("/jobs/search/suggestions", {
    params: { prefix },
  });
  return res.data.data as string[];
};

export const getRecentSearches = async () => {
  const res = await api.get<any>("/jobs/search/recent");
  return res.data.data as string[];
};

export const saveJob = async (jobId: string) => {
  const res = await api.post(`/jobs/${jobId}/save`);
  return res.data;
};

export const unsaveJob = async (jobId: string) => {
  const res = await api.delete(`/jobs/${jobId}/save`);
  return res.data;
};

export const getSavedJobs = async (page: number = 0, size: number = 10) => {
  const res = await api.get<any>("/jobs/saved/list", {
    params: { page, size },
  });
  return res.data.data as PageResponse<Job>;
};

export const applyJob = async (id: string) => {
  const res = await api.post(`/jobs/${id}/apply`);
  return res.data;
};
