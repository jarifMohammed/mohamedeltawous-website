// src/features/newScenario/types/newScenario.types.ts

export interface MovingFactor {
  category: string;
  description: string;
}

export interface CompanyInfo {
  projectTitle: string;
  name: string;
  industry: string;
  focalQuestion: string;
  companySummary: string;
  horizonYear: string;
  horizonMonth: string;
  websiteUrl?: string;
}

export interface DrivingForce {
  id: string;
  category: string;
  title: string;
  description: string;
  /** Formatted as "Category: Title... Description" */
  formatted: string;
}

export interface ClassifyPayload {
  sessionId?: string;
  company: {
    projectTitle: string;
    name: string;
    industry: string;
    summary: string;
    focalQuestion?: string;
    horizonYear?: string;
  };
  focalQuestion: string;
  forces: string[];
  conversationHistory: { role: string; content: string }[];
}

export interface PredeterminedItem {
  force: string;
  category: string;
  rationale: string;
}

export interface UncertaintyItem {
  force: string;
  impact: string;
  unpredictability: string;
}

export interface ClassifyResponse {
  sessionId?: string;
  workshopAnalysisId?: string;
  success: boolean;
  data: {
    
    predetermined: (string | PredeterminedItem)[];
    uncertainties: (string | UncertaintyItem)[];
  };
  history: { role: string; content: string }[];
}

export interface CreateWorkshopPayload {
  company: {
    projectTitle?: string;
    name: string;
    industry?: string;
    summary?: string;
    focalQuestion: string;
    horizonYear: string;
    horizonMonth: string;
  };
  forces?: string[];
}

export interface CreateWorkshopResponse {
  success: boolean;
  message: string;
  sessionId: string;
  workshopId: string;
}

export interface GuestFactorPayload {
  factor: string;
}

export interface GuestContribution {
  inviteId: string;
  email: string;
  forces: string[];
  addedAt?: string;
}

export interface GuestFactorResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: GuestContribution[];
}

export interface AxesPayload {
  
  company: {
    name: string;
    industry: string;
    summary: string;
  };
  focalQuestion: string;
  horizonYear: string;
  horizonMonth: string;
  classification: {
    predetermined: (string | PredeterminedItem)[];
    uncertainties: (string | UncertaintyItem)[];
  };
  conversationHistory: { role: string; content: string }[];
}

export interface AxisResult {
  label: string;
  selectedForce: string;
  pole1?: string;
  pole2?: string;
  poleA1?: string;
  poleA2?: string;
  poleB1?: string;
  poleB2?: string;
  reason: string;
}

export interface AxesData {
  axisA: AxisResult;
  axisB: AxisResult;
  scenarios?: {
    topRight: { name: string; summary: string; implications?: string };
    topLeft: { name: string; summary: string; implications?: string };
    bottomLeft: { name: string; summary: string; implications?: string };
    bottomRight: { name: string; summary: string; implications?: string };
  };
}

export interface AxesResponse {
  success: boolean;
  data: AxesData;
}

export interface MatrixResponse {
  success: boolean;
  data: MatrixData;
}

export interface Scenario {
  title: string;
  narrative: string;
  risks: string[];
  opportunities: string[];
  strategicImplications: string;
}

export interface MatrixData {
  scenarioA: Scenario; // X+, Y+ (Top Right)
  scenarioB: Scenario; // X-, Y+ (Top Left)
  scenarioC: Scenario; // X-, Y- (Bottom Left)
  scenarioD: Scenario; // X+, Y- (Bottom Right)
}

export interface MatrixPayload {
  company: CompanyInfo;
  axes: AxesData;
  conversationHistory: unknown[];
}

export interface ScenariosPayload {
  company: {
    name: string;
    industry: string;
    summary: string;
  };
  focalQuestion: string;
  horizonYear: string;
  axes: {
    axisA: {
      label: string;
      poleA1: string;
      poleA2: string;
    };
    axisB: {
      label: string;
      poleB1: string;
      poleB2: string;
    };
  };
  forces: string[];
  conversationHistory: { role: string; content: string }[];
}

export interface ScenarioResult {
  id: number;
  name: string;
  combination?: string;
  story: string;
  implications: string;
  signposts: string[];
}

export interface ScenariosResponse {
  success: boolean;
  data: {
    company: {
      name: string;
      focalQuestion: string;
      horizonYear: string;
    };
    scenarios: ScenarioResult[];
    strategicOptions: string[];
    conversationHistory: { role: string; content: string }[];
  };
}

export interface WindtunnelPayload {
  sessionId: string;
  company: {
    name: string;
    focalQuestion: string;
    horizonYear: string;
  };
  scenarios: ScenarioResult[];
  strategicOptions: string[];
  conversationHistory: { role: string; content: string }[];
}

export interface WindtunnelCell {
  rating: string;
  reasoning: string;
}

export interface RobustMoves {
  noRegret: string[];
  keepOpen: string[];
  defer: string[];
}

export interface WindtunnelScenarioEvaluation {
  scenario: string;
  evaluations: Array<{
    option: string;
    rating: string;
    reasoning: string;
  }>;
}

export interface WindtunnelResult {
  windTunnel: WindtunnelCell[][] | WindtunnelScenarioEvaluation[];
  robustMoves: RobustMoves;
  strategicConclusion: string;
  recommendedOption: string;
  generatedOptions?: string[];
}

export interface WindtunnelResponse {
  success: boolean;
  data: WindtunnelResult;
}

export interface ReportPayload {
  sessionId: string;
  workshopState: {
    company: {
      name: string;
      industry: string;
      summary: string;
      focalQuestion: string;
      horizonYear: string;
    };
    classification: {
      predetermined: string[];
      uncertainties: string[];
    };
    axes: {
      axisA: AxisResult;
      axisB: AxisResult;
    };
    scenarios: {
      scenarios: ScenarioResult[];
    };
    windTunnelResult: WindtunnelResult;
  };
}

export interface ReportResponse {
  success: boolean;
  data: {
    pdfUrl: string;
  };
}

export interface ScenarioState {
  inviteToken?: string;
  isInviteMode: boolean;
  currentStep: number;
  company: CompanyInfo;
  forces: DrivingForce[];
  movingFactors: MovingFactor[];
  classification: {
    predetermined: (string | PredeterminedItem)[];
    uncertainties: (string | UncertaintyItem)[];
  } | null;
  axes: AxesData | null;
  scenarios: ScenarioResult[] | null;
  strategicOptions: string[];
  windtunnelData: WindtunnelResult | null;
  conversationHistory: { role: "user" | "assistant"; content: string }[];
  isClassificationModalOpen: boolean;
  isAxesModalOpen: boolean;

  // Actions
  setStep: (step: number) => void;
  setClassificationModal: (isOpen: boolean) => void;
  setAxesModal: (isOpen: boolean) => void;
  updateCompany: (company: Partial<CompanyInfo>) => void;
  addForce: (force: Omit<DrivingForce, "id" | "formatted">) => void;
  removeForce: (id: string) => void;
  updateMovingFactors: (factors: MovingFactor[]) => void;
  setClassification: (data: ScenarioState["classification"]) => void;
  updateAxes: (axes: AxesData) => void;
  setScenarios: (scenarios: ScenarioResult[]) => void;
  updateStrategicOptions: (options: string[]) => void;
  setWindtunnelData: (data: WindtunnelResult) => void;
  addHistory: (role: "user" | "assistant", content: string) => void;
  resetStore: () => void;
}
