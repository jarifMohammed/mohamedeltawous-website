// src/features/newScenario/api/newScenario.api.ts

import axiosInstance from "@/instance/axios-instance";

import {
  AxesPayload,
  AxesResponse,
  ClassifyPayload,
  ClassifyResponse,
  MatrixPayload,
  MatrixResponse,
  ScenariosPayload,
  ScenariosResponse,
  WindtunnelPayload,
  WindtunnelResponse,
  ReportPayload,
  ReportResponse,
} from "../types/newScenario.types";

export type InviteInfo = {
  _id: string;
  ownerId: string;
  inviteEmail: string;
  token: string;
  createdAt?: string;
  updatedAt?: string;
};

export type InviteResponse = {
  success: boolean;
  message: string;
  statusCode?: number;
  data: InviteInfo;
};

export const sendScenarioInvite = async (
  email: string,
): Promise<InviteResponse> => {
  const response = await axiosInstance.post("/invite/send", { email });
  return response.data;
};

export const getScenarioInvite = async (
  token: string,
): Promise<InviteResponse> => {
  const response = await axiosInstance.get(`/invite/invite/${token}`);
  return response.data;
};

// POST /workshop/classify

export const classifyWorkshop = async (
  data: ClassifyPayload,
): Promise<ClassifyResponse> => {
  try {
    const response = await axiosInstance.post(`/workshop/classify`, data, {
      timeout: 180000, // 3 minutes timeout
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

// POST /workshop/axes

export const generateAxes = async (
  data: AxesPayload,
): Promise<AxesResponse> => {
  console.log(data)
  try {
    const response = await axiosInstance.post(`/workshop/axes`, data);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

// POST /workshop/matrix

export const generateMatrix = async (
  data: MatrixPayload,
): Promise<MatrixResponse> => {
  try {
    const response = await axiosInstance.post(`/workshop/matrix`, data);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

// POST /workshop/scenarios

export const generateScenarios = async (
  data: ScenariosPayload,
): Promise<ScenariosResponse> => {
  try {
    const response = await axiosInstance.post(`/workshop/scenarios`, data, {
      timeout: 180000, // 3 minutes timeout
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

// POST /workshop/windtunnel

export const postWindtunnel = async (
  data: WindtunnelPayload,
): Promise<WindtunnelResponse> => {
  try {
    const response = await axiosInstance.post(`/workshop/windtunnel`, data, {
      timeout: 180000, // 3 minutes timeout
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

// POST /workshop/report

export const exportReport = async (
  data: ReportPayload,
): Promise<ReportResponse> => {
  try {
    const response = await axiosInstance.post(`/workshop/report`, data, {
      timeout: 350000,
    });
    console.log(response.data)
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};
