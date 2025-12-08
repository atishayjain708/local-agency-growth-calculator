import { GlobalConfig } from '@/types';

// Load global configuration
export async function loadGlobalConfig(): Promise<GlobalConfig> {
  try {
    const response = await fetch('/config/global-config.json');
    const config = await response.json();
    return config;
  } catch (error) {
    console.error('Failed to load global config:', error);
    // Return default config
    return {
      lead_to_appointment_rate: 0.4,
      max_touches_per_business: 2,
      case_study_multipliers: {
        none: 1.2,
        some: 1.0,
        strong: 0.8
      },
      default_pcpl_min: 450,
      default_pcpl_max: 650,
      volume_slider: {
        min: 5000,
        max_default: 50000,
        default: 10000
      },
      capacity_slider: {
        min: 4,
        max: 40,
        default: 10
      },
      close_rate_options: [0.1, 0.2, 0.3, 0.4],
      close_rate_default: 0.2,
      pricing: {
        min: 200,
        max: 50000
      },
      calendly_url: 'https://calendly.com/your-link'
    };
  }
}

