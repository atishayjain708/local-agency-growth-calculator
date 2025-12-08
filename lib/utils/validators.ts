/**
 * Validate pricing inputs
 */
export function validatePricing(priceLow: number, priceHigh: number, min: number, max: number): string | null {
  if (priceLow < min || priceLow > max) {
    return `Low price must be between $${min} and $${max}`;
  }
  if (priceHigh < min || priceHigh > max) {
    return `High price must be between $${min} and $${max}`;
  }
  if (priceHigh < priceLow) {
    return 'High price must be greater than or equal to low price';
  }
  return null;
}

/**
 * Validate industry selection
 */
export function validateIndustry(industry: any): string | null {
  if (!industry) {
    return 'Please select an industry';
  }
  return null;
}

/**
 * Validate service type
 */
export function validateServiceType(serviceType: string): string | null {
  const validTypes = ['SEO', 'Google Ads', 'Website design or dev', 'Multi service', 'Other'];
  if (!validTypes.includes(serviceType)) {
    return 'Please select a valid service type';
  }
  return null;
}

