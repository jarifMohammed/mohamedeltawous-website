import { useMutation } from "@tanstack/react-query";
import {
  classifyWorkshop,
  generateAxes,
  generateMatrix,
  generateScenarios,
  postWindtunnel,
  exportReport,
  sendScenarioInvite,
  submitGuestFactor,
  deleteGuestFactor,
  getWorkshopBySession,
  createWorkshopSession,
  InviteResponse,
  SendScenarioInvitePayload,
  WorkshopBySessionResponse,
} from "../api/newScenario.api";
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
  CreateWorkshopPayload,
  CreateWorkshopResponse,
} from "../types/newScenario.types";

// POST /workshop/classify

export const useClassifyWorkshop = () => {
  return useMutation<ClassifyResponse, Error, ClassifyPayload>({
    mutationFn: (data: ClassifyPayload) => classifyWorkshop(data),
  });
};

// POST /workshop/create

export const useCreateWorkshopSession = () => {
  return useMutation<CreateWorkshopResponse, Error, CreateWorkshopPayload>({
    mutationFn: (data: CreateWorkshopPayload) => createWorkshopSession(data),
  });
};

// POST /invite/send

export const useSendScenarioInvite = () => {
  return useMutation<InviteResponse, Error, SendScenarioInvitePayload>({
    mutationFn: (payload: SendScenarioInvitePayload) =>
      sendScenarioInvite(payload),
  });
};

// POST /workshop/guest/:token

export const useSubmitGuestFactor = () => {
  return useMutation<
    GuestFactorResponse,
    Error,
    { token: string; data: GuestFactorPayload }
  >({
    mutationFn: ({ token, data }) => submitGuestFactor({ token, data }),
  });
};

// DELETE /workshop/guest/:token

export const useDeleteGuestFactor = () => {
  return useMutation<
    GuestFactorResponse,
    Error,
    { token: string; data: GuestFactorPayload }
  >({
    mutationFn: ({ token, data }) => deleteGuestFactor({ token, data }),
  });
};

// GET /workshop/history/:sessionId

export const useWorkshopBySession = () => {
  return useMutation<WorkshopBySessionResponse, Error, string>({
    mutationFn: (sessionId: string) => getWorkshopBySession(sessionId),
  });
};

// POST /workshop/axes

export const useGenerateAxes = () => {
  return useMutation<AxesResponse, Error, AxesPayload>({
    mutationFn: (data: AxesPayload) => generateAxes(data),
  });
};

// POST /workshop/matrix

export const useGenerateMatrix = () => {
  return useMutation<MatrixResponse, Error, MatrixPayload>({
    mutationFn: (data: MatrixPayload) => generateMatrix(data),
  });
};

// POST /workshop/scenarios

export const useGenerateScenarios = () => {
  return useMutation<ScenariosResponse, Error, ScenariosPayload>({
    mutationFn: (data: ScenariosPayload) => generateScenarios(data),
  });
};

// POST /workshop/windtunnel

export const usePostWindtunnel = () => {
  return useMutation<WindtunnelResponse, Error, WindtunnelPayload>({
    mutationFn: (data: WindtunnelPayload) => postWindtunnel(data),
  });
};

// POST /workshop/report

export const useExportReport = () => {
  return useMutation<ReportResponse, Error, ReportPayload>({
    mutationFn: (data: ReportPayload) => exportReport(data),
  });
};
