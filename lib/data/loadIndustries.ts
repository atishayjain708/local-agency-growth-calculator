import { IndustryConfig } from '@/types';

// Parse CSV data and return industry configs
export function parseIndustriesCSV(csvContent: string): IndustryConfig[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  const industries: IndustryConfig[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const industry: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index];
      const trimmedHeader = header.trim();
      
      // Convert numeric fields
      if (['estimated_business_count', 'pcpl_min', 'pcpl_max', 'starter_volume_default', 'max_suggested_volume'].includes(trimmedHeader)) {
        industry[trimmedHeader] = value ? parseInt(value, 10) : undefined;
      } else {
        industry[trimmedHeader] = value;
      }
    });
    
    industries.push(industry as IndustryConfig);
  }
  
  return industries;
}

// Load industries from CSV file (client-side)
export async function loadIndustries(): Promise<IndustryConfig[]> {
  try {
    const response = await fetch('/data/industries.csv');
    const csvContent = await response.text();
    return parseIndustriesCSV(csvContent);
  } catch (error) {
    console.error('Failed to load industries:', error);
    return [];
  }
}

// Search industries by query
export function searchIndustries(industries: IndustryConfig[], query: string): IndustryConfig[] {
  const lowerQuery = query.toLowerCase();
  return industries.filter(industry => 
    industry.industry_display_name.toLowerCase().includes(lowerQuery) ||
    industry.industry_plural_label.toLowerCase().includes(lowerQuery) ||
    industry.industry_key.toLowerCase().includes(lowerQuery)
  );
}

// Find industry by key
export function findIndustryByKey(industries: IndustryConfig[], key: string): IndustryConfig | null {
  return industries.find(industry => industry.industry_key === key) || null;
}

