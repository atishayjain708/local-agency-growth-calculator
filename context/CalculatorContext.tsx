'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { 
  CalculatorState, 
  IndustryConfig, 
  ServiceType, 
  CaseStudyStrength,
  GlobalConfig,
  CalculationResults
} from '@/types';
import { calculateAll } from '@/lib/calculator/calculatorService';
import { loadGlobalConfig } from '@/lib/data/loadConfig';

interface CalculatorContextType {
  state: CalculatorState;
  globalConfig: GlobalConfig | null;
  setIndustry: (industry: IndustryConfig | null) => void;
  setServiceType: (serviceType: ServiceType) => void;
  setCaseStudyStrength: (strength: CaseStudyStrength) => void;
  setCaseStudyText: (text: string) => void;
  setPricing: (low: number, high: number) => void;
  setCloseRate: (rate: number) => void;
  setProspectsPerMonth: (prospects: number) => void;
  setCapacity: (capacity: number) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  recalculate: () => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

const initialState: CalculatorState = {
  industry: null,
  service_type: 'SEO',
  case_study_strength: 'some',
  case_study_text: '',
  price_low: 1000,
  price_high: 3000,
  close_rate: 0.2,
  prospects_per_month: 10000,
  capacity_calls_per_month: 10,
  calculations: null,
  currentStep: 0,
  isCalculating: false,
};

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig | null>(null);

  // Load global config on mount
  useEffect(() => {
    loadGlobalConfig().then(setGlobalConfig);
  }, []);

  const setIndustry = useCallback((industry: IndustryConfig | null) => {
    setState(prev => ({ ...prev, industry }));
  }, []);

  const setServiceType = useCallback((serviceType: ServiceType) => {
    setState(prev => ({ ...prev, service_type: serviceType }));
  }, []);

  const setCaseStudyStrength = useCallback((strength: CaseStudyStrength) => {
    setState(prev => ({ ...prev, case_study_strength: strength }));
  }, []);

  const setCaseStudyText = useCallback((text: string) => {
    setState(prev => ({ ...prev, case_study_text: text }));
  }, []);

  const setPricing = useCallback((low: number, high: number) => {
    setState(prev => ({ ...prev, price_low: low, price_high: high }));
  }, []);

  const setCloseRate = useCallback((rate: number) => {
    setState(prev => ({ ...prev, close_rate: rate }));
  }, []);

  const setProspectsPerMonth = useCallback((prospects: number) => {
    setState(prev => ({ ...prev, prospects_per_month: prospects }));
  }, []);

  const setCapacity = useCallback((capacity: number) => {
    setState(prev => ({ ...prev, capacity_calls_per_month: capacity }));
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }));
  }, []);

  const recalculate = useCallback(() => {
    if (!state.industry || !globalConfig) return;

    setState(prev => ({ ...prev, isCalculating: true }));

    try {
      const results: CalculationResults = calculateAll(
        {
          industry: state.industry,
          case_study_strength: state.case_study_strength,
          price_low: state.price_low,
          price_high: state.price_high,
          close_rate: state.close_rate,
          prospects_per_month: state.prospects_per_month,
        },
        globalConfig
      );

      setState(prev => ({
        ...prev,
        calculations: results,
        isCalculating: false,
      }));
    } catch (error) {
      console.error('Calculation error:', error);
      setState(prev => ({ ...prev, isCalculating: false }));
    }
  }, [state.industry, state.case_study_strength, state.price_low, state.price_high, state.close_rate, state.prospects_per_month, globalConfig]);

  const value: CalculatorContextType = {
    state,
    globalConfig,
    setIndustry,
    setServiceType,
    setCaseStudyStrength,
    setCaseStudyText,
    setPricing,
    setCloseRate,
    setProspectsPerMonth,
    setCapacity,
    setCurrentStep,
    nextStep,
    prevStep,
    recalculate,
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}

