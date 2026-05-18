import api from "./api";
import { useAuthStore } from "../store/useAuthStore";

export type ApplicationStatus = "SUBMITTED" | "REVIEWING" | "ACCEPTED" | "REJECTED";

export interface ApplicationSubmissionRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  cvUrl: string;
  coverLetter?: string;
  jobId: string;
}

export interface ApplicationSubmissionResponse {
  success: boolean;
  message: string;
  applicationId: string; // UUID as string
  status: ApplicationStatus | string;
}

export interface JobDto {
  id: string;
  title: string;
  company?: {
    id: string;
    name: string;
  };
}

export interface ApplicationDetailDto {
  applicationId: string;
  status: ApplicationStatus | string;
  appliedAt: string;
  cvUrl: string;
  coverLetter?: string | null;
  job: any;
  candidate?: any;
}

export interface NotificationDetailDto {
  notificationId: string;
  type: string;
  status: string;
  createdAt: string;
  title: string;
  message: string;
  application: ApplicationDetailDto;
}

export const submitApplication = async (
  payload: ApplicationSubmissionRequest
): Promise<ApplicationSubmissionResponse> => {
  const user = useAuthStore.getState().user;

  // Mock server (server.ts) expects these headers:
  // - x-user-id
  // - x-user-email
  // - x-user-name
  // Even if Zustand user is missing, we still send them based on payload.
  const headers: Record<string, string> = {};

  headers["x-user-email"] = user?.email ?? payload.email;
  headers["x-user-name"] = user?.name ?? payload.fullName;

  // Mock server uses x-user-id only for identity.
  // For candidate role, we can safely default to "1".
  // (server.ts mock: candidate@example.com / vuxhide@gmail.com => id: "1")
  headers["x-user-id"] = user?.id ?? "1";

  const res = await api.post(
    `/jobs/${payload.jobId}/apply`,
    payload,
    { headers }
  );

  return res.data?.data as ApplicationSubmissionResponse;
};

export const getMyNotifications = async (page = 0, size = 10) => {
  const res = await api.get("/notifications/me", {
    params: { page, size },
  });
  return res.data.data as NotificationDetailDto[];
};

export const getNotificationDetail = async (notificationId: string) => {
  const res = await api.get(`/notifications/${notificationId}`);
  return res.data.data as NotificationDetailDto;
};

export const getMyApplications = async (page = 0, size = 10) => {
  const res = await api.get("/applications/me", {
    params: { page, size },
  });
  return res.data.data as ApplicationDetailDto[];
};
