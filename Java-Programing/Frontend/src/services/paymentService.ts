import api from "./api";

export interface PaymentRequest {
  amount: number;
  paymentType: string;
}

export interface PaymentResponse {
  transactionId: string;
  qrUrl: string;
  amount: number;
  bankBin: string;
  accountNumber: string;
  accountName: string;
}

export const paymentService = {
  createPayment: async (data: PaymentRequest): Promise<PaymentResponse> => {
    const response = await api.post("/payments/create", data);
    return response.data.data;
  },

  confirmPayment: async (transactionId: string): Promise<void> => {
    await api.post(`/payments/confirm/${transactionId}`);
  },

  simulateWebhook: async (transactionId: string): Promise<void> => {
    await api.post(`/payments/webhook/${transactionId}`);
  },

  getStatus: async (transactionId: string): Promise<any> => {
    const response = await api.get(`/payments/${transactionId}`);
    return response.data.data;
  },
};
