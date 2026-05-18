import { useState, useEffect } from "react";
import api from "../services/api";

interface AdminState {
  stats: any;
  users: any[];
  jobs: any[];
  transactions: any[];
  loading: boolean;
  fetchStats: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchJobs: () => Promise<void>;
}

import { create } from "zustand";

export const useAdminStore = create<AdminState>((set) => ({
  stats: null,
  users: [],
  jobs: [],
  transactions: [],
  loading: false,
  fetchStats: async () => {
    set({ loading: true });
    const res = await api.get("/admin/stats");
    set({ stats: res.data, loading: false });
  },
  fetchUsers: async () => {
    const res = await api.get("/admin/users");
    set({ users: res.data });
  },
  fetchJobs: async () => {
    const res = await api.get("/admin/jobs");
    set({ jobs: res.data });
  },
}));
