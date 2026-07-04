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
  GuestFactorPayload,
  GuestFactorResponse,
  GuestContribution,
  CompanyInfo,
  CreateWorkshopPayload,
  CreateWorkshopResponse,
} from "../types/newScenario.types";

export type InviteWorkshopInfo = {
  _id: string;
  sessionId: string;
  company?: Partial<CompanyInfo> & {
    summary?: string;
  };
  forces?: string[];
  guestAdd?: GuestContribution[];
};

export type InviteInfo = {
  _id: string;
  ownerId: string;
  workshopAnalysisId?: InviteWorkshopInfo;
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

export type SendScenarioInvitePayload = {
  email: string;
  sessionId: string;
};

export const sendScenarioInvite = async ({
  email,
  sessionId,
}: SendScenarioInvitePayload): Promise<InviteResponse> => {
  const response = await axiosInstance.post("/invite/send", {
    email,
    sessionId,
  });
  return response.data;
};

export const createWorkshopSession = async (
  data: CreateWorkshopPayload,
): Promise<CreateWorkshopResponse> => {
  const response = await axiosInstance.post("/workshop/create", data);
  return response.data;
};

export const getScenarioInvite = async (
  token: string,
): Promise<InviteResponse> => {
  const response = await axiosInstance.get(`/invite/invite/${token}`);
  return response.data;
};

export const submitGuestFactor = async ({
  token,
  data,
}: {
  token: string;
  data: GuestFactorPayload;
}): Promise<GuestFactorResponse> => {
  const response = await axiosInstance.post(`/workshop/guest/${token}`, data);
  return response.data;
};

export const deleteGuestFactor = async ({
  token,
  data,
}: {
  token: string;
  data: GuestFactorPayload;
}): Promise<GuestFactorResponse> => {
  const response = await axiosInstance.delete(`/workshop/guest/${token}`, {
    data,
  });
  return response.data;
};

export type WorkshopBySessionResponse = {
  success: boolean;
  message?: string;
  data: {
    _id: string;
    sessionId: string;
    company?: {
      projectTitle?: string;
      name?: string;
      industry?: string;
      summary?: string;
      focalQuestion?: string;
      horizonYear?: string;
    };
    forces?: string[];
    guestAdd?: GuestContribution[];
  };
};

export const getWorkshopBySession = async (
  sessionId: string,
): Promise<WorkshopBySessionResponse> => {
  const response = await axiosInstance.get(`/workshop/history/${sessionId}`);
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
