import { useMutation } from "@tanstack/react-query";
import {
  classifyWorkshop,
  generateAxes,
  generateMatrix,
  generateScenarios,
  postWindtunnel,
  exportReport,
  sendScenarioInvite,
  InviteResponse,
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
} from "../types/newScenario.types";

// POST /workshop/classify

export const useClassifyWorkshop = () => {
  return useMutation<ClassifyResponse, Error, ClassifyPayload>({
    mutationFn: (data: ClassifyPayload) => classifyWorkshop(data),
  });
};

// POST /invite/send

export const useSendScenarioInvite = () => {
  return useMutation<InviteResponse, Error, string>({
    mutationFn: (email: string) => sendScenarioInvite(email),
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
