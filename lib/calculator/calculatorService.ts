import { 
  IndustryConfig, 
  GlobalConfig, 
  CaseStudyStrength, 
  CalculationResults,
  CalculatorInputs 
} from '@/types';

/**
 * Get adjusted PCPL values based on case study strength
 */
export function getAdjustedPCPL(
  industry: IndustryConfig,
  caseStudyStrength: CaseStudyStrength,
  globalConfig: GlobalConfig
): { pcpl_min_adj: number; pcpl_max_adj: number; pcpl_mid: number } {
  const multiplier = globalConfig.case_study_multipliers[caseStudyStrength];
  
  const pcpl_min_base = industry.pcpl_min || globalConfig.default_pcpl_min;
  const pcpl_max_base = industry.pcpl_max || globalConfig.default_pcpl_max;
  
  const pcpl_min_adj = pcpl_min_base * multiplier;
  const pcpl_max_adj = pcpl_max_base * multiplier;
  const pcpl_mid = (pcpl_min_adj + pcpl_max_adj) / 2;
  
  return { pcpl_min_adj, pcpl_max_adj, pcpl_mid };
}

/**
 * Calculate lead range based on prospects and PCPL
 */
export function calculateLeadRange(
  prospectsPerMonth: number,
  pcplMinAdj: number,
  pcplMaxAdj: number
): { leads_min: number; leads_max: number; leads_mid: number } {
  const leads_min = Math.round(prospectsPerMonth / pcplMaxAdj);
  const leads_max = Math.round(prospectsPerMonth / pcplMinAdj);
  const pcpl_mid = (pcplMinAdj + pcplMaxAdj) / 2;
  const leads_mid = Math.round(prospectsPerMonth / pcpl_mid);
  
  return { leads_min, leads_max, leads_mid };
}

/**
 * Calculate appointment range based on leads
 */
export function calculateAppointmentRange(
  leadsMin: number,
  leadsMax: number,
  leadsMid: number,
  leadToAppointmentRate: number
): { appointments_min: number; appointments_max: number; appointments_mid: number } {
  const appointments_min = Math.round(leadsMin * leadToAppointmentRate);
  const appointments_max = Math.round(leadsMax * leadToAppointmentRate);
  const appointments_mid = Math.round(leadsMid * leadToAppointmentRate);
  
  return { appointments_min, appointments_max, appointments_mid };
}

/**
 * Calculate client range based on appointments and close rate
 */
export function calculateClientRange(
  appointmentsMin: number,
  appointmentsMax: number,
  appointmentsMid: number,
  closeRate: number
): { clients_min: number; clients_max: number; clients_mid: number } {
  const clients_min = Math.max(1, Math.round(appointmentsMin * closeRate));
  const clients_max = Math.max(1, Math.round(appointmentsMax * closeRate));
  const clients_mid = Math.max(1, Math.round(appointmentsMid * closeRate));
  
  return { clients_min, clients_max, clients_mid };
}

/**
 * Calculate MRR and annual revenue range
 */
export function calculateMRRRange(
  clientsMin: number,
  clientsMax: number,
  priceLow: number,
  priceHigh: number
): { mrr_low: number; mrr_high: number; annual_low: number; annual_high: number } {
  const mrr_low = Math.round((clientsMin * priceLow) / 100) * 100; // Round to nearest hundred
  const mrr_high = Math.round((clientsMax * priceHigh) / 100) * 100;
  const annual_low = mrr_low * 12;
  const annual_high = mrr_high * 12;
  
  return { mrr_low, mrr_high, annual_low, annual_high };
}

/**
 * Main calculation function that orchestrates all calculations
 */
export function calculateAll(
  inputs: CalculatorInputs,
  globalConfig: GlobalConfig
): CalculationResults {
  // Get adjusted PCPL
  const { pcpl_min_adj, pcpl_max_adj, pcpl_mid } = getAdjustedPCPL(
    inputs.industry,
    inputs.case_study_strength,
    globalConfig
  );
  
  // Calculate leads
  const { leads_min, leads_max, leads_mid } = calculateLeadRange(
    inputs.prospects_per_month,
    pcpl_min_adj,
    pcpl_max_adj
  );
  
  // Calculate appointments
  const { appointments_min, appointments_max, appointments_mid } = calculateAppointmentRange(
    leads_min,
    leads_max,
    leads_mid,
    globalConfig.lead_to_appointment_rate
  );
  
  // Calculate clients
  const { clients_min, clients_max, clients_mid } = calculateClientRange(
    appointments_min,
    appointments_max,
    appointments_mid,
    inputs.close_rate
  );
  
  // Calculate MRR
  const { mrr_low, mrr_high, annual_low, annual_high } = calculateMRRRange(
    clients_min,
    clients_max,
    inputs.price_low,
    inputs.price_high
  );
  
  return {
    pcpl_min_adj,
    pcpl_max_adj,
    pcpl_mid,
    leads_min,
    leads_max,
    leads_mid,
    appointments_min,
    appointments_max,
    appointments_mid,
    clients_min,
    clients_max,
    clients_mid,
    mrr_low,
    mrr_high,
    annual_low,
    annual_high,
  };
}

/**
 * Calculate maximum suggested volume based on TAM
 */
export function calculateMaxVolume(
  estimatedBusinessCount: number,
  maxTouchesPerBusiness: number,
  maxDefault: number
): number {
  return Math.min(maxDefault, estimatedBusinessCount * maxTouchesPerBusiness);
}

/**
 * Validate if requested volume exceeds TAM
 */
export function isVolumeWithinTAM(
  requestedVolume: number,
  estimatedBusinessCount: number,
  maxTouchesPerBusiness: number
): boolean {
  const maxVolume = estimatedBusinessCount * maxTouchesPerBusiness;
  return requestedVolume <= maxVolume;
}

