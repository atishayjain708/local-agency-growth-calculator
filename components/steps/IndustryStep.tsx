'use client';

import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@/components/ui/Autocomplete';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { IndustryConfig, ServiceType } from '@/types';
import { loadIndustries } from '@/lib/data/loadIndustries';

interface IndustryStepProps {
  industry: IndustryConfig | null;
  serviceType: ServiceType;
  onIndustryChange: (industry: IndustryConfig | null) => void;
  onServiceTypeChange: (serviceType: ServiceType) => void;
}

const SERVICE_OPTIONS = [
  { value: 'SEO', label: 'SEO' },
  { value: 'Google Ads', label: 'Google Ads' },
  { value: 'Website design or dev', label: 'Web Design' },
  { value: 'Multi service', label: 'Multi-service' },
  { value: 'Other', label: 'Other' },
];

export function IndustryStep({ 
  industry, 
  serviceType, 
  onIndustryChange, 
  onServiceTypeChange 
}: IndustryStepProps) {
  const [industries, setIndustries] = useState<IndustryConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIndustries().then(data => {
      setIndustries(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading industries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Let&apos;s start with your target market
        </h2>
        <p className="text-gray-600">
          Which local niche do you want more clients from first?
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <Autocomplete
          label="Target Industry"
          placeholder="Search for an industry (e.g., plumbers, dentists...)"
          options={industries}
          value={industry}
          onChange={onIndustryChange}
        />
        
        <SegmentedControl
          label="What do you mainly sell to them?"
          options={SERVICE_OPTIONS}
          value={serviceType}
          onChange={(value) => onServiceTypeChange(value as ServiceType)}
        />
      </div>
    </div>
  );
}

