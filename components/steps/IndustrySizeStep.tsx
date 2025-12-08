'use client';

import React from 'react';
import { IndustryConfig } from '@/types';
import { formatNumber } from '@/lib/utils/formatters';

interface IndustrySizeStepProps {
  industry: IndustryConfig;
  onChangeIndustry: () => void;
}

export function IndustrySizeStep({ industry, onChangeIndustry }: IndustrySizeStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Local market size check
        </h2>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <p className="text-lg text-gray-700">
            Based on our internal directory data for <strong>{industry.industry_display_name}</strong>, we estimate about{' '}
            <strong className="text-primary-600 text-xl">
              {formatNumber(industry.estimated_business_count)} {industry.industry_plural_label}
            </strong>{' '}
            {industry.example_text || 'in your target market'}.
          </p>
          
          <p className="text-gray-600">
            That&apos;s plenty of room to run consistent outbound without burning the niche.
          </p>
        </div>
        
        <div className="pt-4 border-t border-gray-200 text-center">
          <button
            onClick={onChangeIndustry}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm underline"
          >
            Change industry
          </button>
        </div>
      </div>
    </div>
  );
}

