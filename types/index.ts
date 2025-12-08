export interface IndustryConfig {
  industry_key: string;
  industry_display_name: string;
  industry_plural_label: string;
  estimated_business_count: number;
  pcpl_min: number;
  pcpl_max: number;
  starter_volume_default: number;
  max_suggested_volume?: number;
  example_text?: string;
  notes?: string;
}

export type ServiceType = 'SEO' | 'Google Ads' | 'Website design or dev' | 'Multi service' | 'Other';

export type CaseStudyStrength = 'none' | 'some' | 'strong';

export interface GlobalConfig {
  lead_to_appointment_rate: number;
  max_touches_per_business: number;
  case_study_multipliers: {
    none: number;
    some: number;
    strong: number;
  };
  default_pcpl_min: number;
  default_pcpl_max: number;
  volume_slider: {
    min: number;
    max_default: number;
    default: number;
  };
  capacity_slider: {
    min: number;
    max: number;
    default: number;
  };
  close_rate_options: number[];
  close_rate_default: number;
  pricing: {
    min: number;
    max: number;
  };
  calendly_url: string;
}

export interface CalculationResults {
  pcpl_min_adj: number;
  pcpl_max_adj: number;
  pcpl_mid: number;
  leads_min: number;
  leads_max: number;
  leads_mid: number;
  appointments_min: number;
  appointments_max: number;
  appointments_mid: number;
  clients_min: number;
  clients_max: number;
  clients_mid: number;
  mrr_low: number;
  mrr_high: number;
  annual_low: number;
  annual_high: number;
}

export interface CalculatorState {
  // User inputs
  industry: IndustryConfig | null;
  service_type: ServiceType;
  case_study_strength: CaseStudyStrength;
  case_study_text: string;
  price_low: number;
  price_high: number;
  close_rate: number;
  prospects_per_month: number;
  capacity_calls_per_month: number;
  
  // Calculated outputs
  calculations: CalculationResults | null;
  
  // UI state
  currentStep: number;
  isCalculating: boolean;
}

export interface CalculatorInputs {
  industry: IndustryConfig;
  case_study_strength: CaseStudyStrength;
  price_low: number;
  price_high: number;
  close_rate: number;
  prospects_per_month: number;
}

