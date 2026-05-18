import api from "./api";

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: "MONTHLY" | "YEARLY";
  features: string[];
  recommended?: boolean;
}

export const vipService = {
  getPlans: async (): Promise<Plan[]> => {
    const res = await api.get("/vip/plans");
    return res.data.data;
  },

  createPayment: async (planId: string) => {
    const res = await api.post("/payments/create", { planId });
    return res.data;
  },

  confirmSubscription: async (paymentId: string) => {
    const res = await api.post("/payments/confirm", { paymentId });
    return res.data;
  },

  getMySubscription: async () => {
    const res = await api.get("/vip/my-subscription");
    return res.data;
  }
};
