import api from "./api";

export const authService = {
  login: async (data: any) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  googleLogin: async (data: any) => {
    const res = await api.post("/auth/google", data);
    return res.data;
  },
  
  register: async (data: any) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
  
  logout: async () => {
    await api.post("/auth/logout");
  },
  
  refreshToken: async () => {
    const res = await api.post("/auth/refresh");
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await api.post("/auth/forgot-password", { email });
    return res.data;
  },

  resetPassword: async (data: any) => {
    const res = await api.post("/auth/reset-password", data);
    return res.data;
  }
};
