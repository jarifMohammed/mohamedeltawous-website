import axiosInstance from "@/instance/axios-instance";
import { GetPaymentsParams, GetPaymentsResponse } from "../types/payments.types";

export const getAdminPayments = async (
  params: GetPaymentsParams
): Promise<GetPaymentsResponse> => {
  try {
    const response = await axiosInstance.get("/subscription/admin/payments", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
