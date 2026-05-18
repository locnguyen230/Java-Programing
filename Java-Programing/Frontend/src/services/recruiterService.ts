import api from "./api";

export interface EmployerJob {
  id: string;
  title: string;
  status?: string;
  deleted?: boolean;
  company?: {
    id: string;
    name: string;
    logoUrl: string;
  };
  createdAt?: string;
  deadline?: string;
}

export interface EmployerApplicant {
  applicationId: string;
  status?: string;
  appliedAt?: string;
  cvUrl?: string;
  coverLetter?: string;
  phoneNumber?: string;
  candidate?: {
    userId?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
}

export const getEmployerJobs = async (): Promise<EmployerJob[]> => {
  const res = await api.get("/jobs/employer/jobs");
  return res.data?.data ?? res.data;
};

export const getJobApplicants = async (jobId: string): Promise<any[]> => {
  const res = await api.get(`/jobs/employer/jobs/${jobId}/applicants`);
  return res.data?.data ?? res.data;
};

export const acceptApplication = async (applicationId: string) => {
  const res = await api.post(`/jobs/employer/applications/${applicationId}/accept`);
  return res.data;
};

export const rejectApplication = async (applicationId: string) => {
  const res = await api.post(`/jobs/employer/applications/${applicationId}/reject`);
  return res.data;
};

export type RecruiterCreateJobPayload = {
  title: string;
  description: string;
  requirements: string;

  minSalary?: number | null;
  maxSalary?: number | null;
  salaryUnit?: string;

  location?: string;

  experience?: string; // FRESHER | JUNIOR | MID | SENIOR
  employmentType?: string; // FULL_TIME | PART_TIME | INTERNSHIP | REMOTE | CONTRACT

  skills?: string; // comma-separated string (backend stores CSV)
  benefits?: string;
  tags?: string; // comma-separated
  category?: string;
  workMode?: string;
  deadline?: string; // ISO string if provided
  featured?: boolean;
  quantity?: number;
  status?: string;
};

export const createEmployerJob = async (payload: RecruiterCreateJobPayload) => {
  const res = await api.post("/jobs/employer/jobs", payload);
  return res.data?.data ?? res.data;
};

export const publishEmployerJob = async (jobId: string) => {
  const res = await api.post(`/jobs/employer/jobs/${jobId}/publish`);
  return res.data?.data ?? res.data;
};
