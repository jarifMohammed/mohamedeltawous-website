import axiosInstance from "@/instance/axios-instance";
import { GetUsersParams, GetUsersResponse, GetUserByIdResponse, GetUserPaymentsResponse } from "../types/users.types";

export const getAllUsers = async (
  params: GetUsersParams
): Promise<GetUsersResponse> => {
  try {
    const response = await axiosInstance.get("/users/admin/all", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (
  userId: string
): Promise<GetUserByIdResponse> => {
  try {
    const response = await axiosInstance.get(`/users/admin/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserPayments = async (
  userId: string,
  params?: { page?: number; limit?: number }
): Promise<GetUserPaymentsResponse> => {
  try {
    const response = await axiosInstance.get(
      `/subscription/admin/users/${userId}/payments`,
      { params }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
