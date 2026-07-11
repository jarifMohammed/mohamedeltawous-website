// src/features/newScenario/store/ScenarioContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  ScenarioState,
  CompanyInfo,
  DrivingForce,
  MovingFactor,
  ScenarioResult,
  AxesData,
  WindtunnelResult,
} from "../types/newScenario.types";
import {
  saveScenarioState,
  loadScenarioState,
  clearScenarioState,
} from "./scenarioStorage";

const emptyCompany: CompanyInfo = {
  projectTitle: "",
  name: "",
  industry: "",
  focalQuestion: "",
  companySummary: "",
  horizonYear: "",
  horizonMonth: "",
  websiteUrl: "",
};

const defaultStrategicOptions: string[] = [];

const ScenarioContext = createContext<ScenarioState | undefined>(undefined);

export const ScenarioProvider: React.FC<{
  children: ReactNode;
  inviteToken?: string;
}> = ({ children, inviteToken }) => {
  const isInviteMode = Boolean(inviteToken);
  const [initialState] = useState(() =>
    isInviteMode ? null : loadScenarioState(),
  );
  const [currentStep, setCurrentStep] = useState(
    isInviteMode ? 3 : initialState?.currentStep || 1,
  );
  const [company, setCompany] = useState<CompanyInfo>(
    initialState?.company || { ...emptyCompany },
  );
  const [forces, setForces] = useState<DrivingForce[]>(
    initialState?.forces || [],
  );
  const [movingFactors, setMovingFactors] = useState<MovingFactor[]>(
    initialState?.movingFactors || [],
  );
  const [classification, setClassification] =
    useState<ScenarioState["classification"]>(
      initialState?.classification || null,
    );
  const [axes, setAxes] = useState<AxesData | null>(
    initialState?.axes || null,
  );
  const [scenarios, setScenarios] = useState<ScenarioResult[] | null>(
    initialState?.scenarios || null,
  );
  const [strategicOptions, setStrategicOptions] = useState<string[]>(
    initialState?.strategicOptions || defaultStrategicOptions,
  );
  const [windtunnelData, setWindtunnelData] = useState<WindtunnelResult | null>(
    initialState?.windtunnelData || null,
  );
  const [conversationHistory, setConversationHistory] = useState<
    ScenarioState["conversationHistory"]
  >(initialState?.conversationHistory || []);
  const [isClassificationModalOpen, setIsClassificationModalOpen] =
    useState(false);
  const [isAxesModalOpen, setIsAxesModalOpen] = useState(false);

  useEffect(() => {
    if (inviteToken) {
      localStorage.setItem("inviteToken", inviteToken);
    } else {
      localStorage.removeItem("inviteToken");
    }

    return () => {
      localStorage.removeItem("inviteToken");
    };
  }, [inviteToken]);

  useEffect(() => {
    if (inviteToken) {
      localStorage.setItem("inviteToken", inviteToken);
    } else {
      localStorage.removeItem("inviteToken");
    }

    return () => {
      localStorage.removeItem("inviteToken");
    };
  }, [inviteToken]);

  // Whenever state changes, sync to localStorage to "persist across function calls"
  useEffect(() => {
    if (isInviteMode) return;

    saveScenarioState({
      currentStep,
      company,
      forces,
      movingFactors,
      classification,
      axes,
      scenarios,
      strategicOptions,
      windtunnelData,
      conversationHistory,
    });
  }, [
    currentStep,
    company,
    forces,
    movingFactors,
    classification,
    axes,
    scenarios,
    strategicOptions,
    windtunnelData,
    conversationHistory,
    isInviteMode,
  ]);

  const setStep = useCallback(
    (step: number) => setCurrentStep(isInviteMode ? 3 : step),
    [isInviteMode],
  );
  const setClassificationModal = useCallback(
    (isOpen: boolean) => setIsClassificationModalOpen(isOpen),
    [],
  );
  const setAxesModal = useCallback(
    (isOpen: boolean) => setIsAxesModalOpen(isOpen),
    [],
  );

  const updateCompanyAction = useCallback((update: Partial<CompanyInfo>) => {
    setCompany((prev) => ({ ...prev, ...update }));
  }, []);

  const addForce = useCallback(
    ({
      category,
      title,
      description,
    }: Omit<DrivingForce, "id" | "formatted">) => {
      const identifier = title.trim() || category;
      const newForce: DrivingForce = {
        id: crypto.randomUUID(),
        category,
        title,
        description,
        formatted: `${identifier} : ${description}`,
      };
      setForces((prev) => [...prev, newForce]);
    },
    [],
  );

  const removeForce = useCallback((id: string) => {
    setForces((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const updateMovingFactors = useCallback((factors: MovingFactor[]) => {
    setMovingFactors(factors);
  }, []);

  const setClassificationAction = useCallback(
    (data: ScenarioState["classification"]) => {
      setClassification(data);
    },
    [],
  );

  const updateAxes = useCallback((data: AxesData) => {
    setAxes(data);
  }, []);

  const setScenariosAction = useCallback((data: ScenarioResult[]) => {
    setScenarios(data);
  }, []);

  const updateStrategicOptions = useCallback((options: string[]) => {
    setStrategicOptions(options);
  }, []);

  const setWindtunnelDataAction = useCallback((data: WindtunnelResult) => {
    setWindtunnelData(data);
  }, []);

  const addHistory = useCallback(
    (role: "user" | "assistant", content: string) => {
      setConversationHistory((prev) => [...prev, { role, content }]);
    },
    [],
  );

  const resetStore = useCallback(() => {
    setCurrentStep(isInviteMode ? 3 : 1);
    setCompany({ ...emptyCompany });
    setForces([]);
    setMovingFactors([]);
    setClassification(null);
    setAxes(null);
    setScenarios(null);
    setStrategicOptions(defaultStrategicOptions);
    setWindtunnelData(null);
    setConversationHistory([]);
    setIsClassificationModalOpen(false);
    setIsAxesModalOpen(false);
    clearScenarioState();
    if (!isInviteMode) {
      localStorage.removeItem("sessionId");
      localStorage.removeItem("workshopAnalysisId");
    }
  }, [isInviteMode]);

  const value: ScenarioState = {
    inviteToken,
    isInviteMode,
    currentStep,
    company,
    forces,
    movingFactors,
    classification,
    axes,
    scenarios,
    strategicOptions,
    windtunnelData,
    conversationHistory,
    isClassificationModalOpen,
    isAxesModalOpen,
    setStep,
    setClassificationModal,
    setAxesModal,
    updateCompany: updateCompanyAction,
    addForce,
    removeForce,
    updateMovingFactors,
    setClassification: setClassificationAction,
    updateAxes,
    setScenarios: setScenariosAction,
    updateStrategicOptions,
    setWindtunnelData: setWindtunnelDataAction,
    addHistory,
    resetStore,
  };

  return (
    <ScenarioContext.Provider value={value}>
      {children}
    </ScenarioContext.Provider>
  );
};

export const useScenarioContext = () => {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error(
      "useScenarioContext must be used within a ScenarioProvider",
    );
  }
  return context;
};
