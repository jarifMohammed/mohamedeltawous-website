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
  PredeterminedItem,
  UncertaintyItem,
} from "../types/newScenario.types";
import { saveScenarioState, clearScenarioState } from "./scenarioStorage";

const emptyCompany: CompanyInfo = {
  projectTitle: "",
  name: "",
  industry: "",
  focalQuestion: "",
  companySummary: "",
  horizonYear: "2030",
  websiteUrl: "",
};

const defaultStrategicOptions: string[] = [];

const ScenarioContext = createContext<ScenarioState | undefined>(undefined);

export const ScenarioProvider: React.FC<{
  children: ReactNode;
  inviteToken?: string;
}> = ({ children, inviteToken }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [company, setCompany] = useState<CompanyInfo>({ ...emptyCompany });
  const [forces, setForces] = useState<DrivingForce[]>([]);
  const [movingFactors, setMovingFactors] = useState<MovingFactor[]>([]);
  const [classification, setClassification] =
    useState<ScenarioState["classification"]>(null);
  const [axes, setAxes] = useState<AxesData | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioResult[] | null>(null);
  const [strategicOptions, setStrategicOptions] = useState<string[]>(
    defaultStrategicOptions,
  );
  const [windtunnelData, setWindtunnelData] = useState<WindtunnelResult | null>(
    null,
  );
  const [conversationHistory, setConversationHistory] = useState<
    ScenarioState["conversationHistory"]
  >([]);
  const [isClassificationModalOpen, setIsClassificationModalOpen] =
    useState(false);
  const [isAxesModalOpen, setIsAxesModalOpen] = useState(false);

  // Clear localStorage on fresh mount (i.e., page refresh)
  useEffect(() => {
    console.log(
      "New Scenario Workshop initialized. Clearing localStorage as per requirements.",
    );
    clearScenarioState();
  }, []);

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
  ]);

  const setStep = useCallback((step: number) => setCurrentStep(step), []);
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
    setCurrentStep(1);
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
  }, []);

  const value: ScenarioState = {
    inviteToken,
    isInviteMode: Boolean(inviteToken),
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
