import api from "./api";

export const getAdminStats = () => api.get("/admin/stats");
export const getAllUsers = () => api.get("/admin/users");
export const getAllJobs = () => api.get("/admin/jobs");
export const deleteUser = (id: string) => api.delete(`/admin/users/${id}`);
export const approveJob = (id: string) => api.patch(`/admin/jobs/${id}/approve`);
