'use client';

import React from 'react';
import { IndustryConfig, ServiceType } from '@/types';
import { formatNumber } from '@/lib/utils/formatters';

interface ProcessStepProps {
  industry: IndustryConfig;
  serviceType: ServiceType;
  prospectsPerMonth: number;
}

const PROCESS_STEPS = [
  {
    title: 'Scan and build the list',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    getDescription: (industry: IndustryConfig, prospects: number) =>
      `We map the ${industry.industry_display_name} market in our internal directory, niche-specific sites and Google Maps-style sources, then pull a clean list of ${formatNumber(prospects)} local businesses that fit your ICP.`
  },
  {
    title: 'Turn your results into outreach',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    getDescription: (industry: IndustryConfig, _: number, serviceType: ServiceType) =>
      `We plug your ${serviceType} case studies into our messaging library for ${industry.industry_display_name} and generate campaigns that speak to the outcomes they care about.`
  },
  {
    title: 'Handle replies and qualify',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    getDescription: (industry: IndustryConfig) =>
      `Our team handles positive replies, answers questions and calls interested prospects to qualify for budget and urgency, so you only see serious ${industry.industry_display_name} owners on your calendar.`
  },
  {
    title: 'You take the calls and close',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    getDescription: () =>
      `You get a steady stream of qualified sales calls, and we keep feeding the top of the funnel so pipeline is not an issue.`
  },
];

export function ProcessStep({ industry, serviceType, prospectsPerMonth }: ProcessStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          How our system works
        </h2>
        <p className="text-gray-600">
          Here&apos;s the data-driven pipeline that generates your results
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="space-y-6">
          {PROCESS_STEPS.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-primary-600">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {step.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {step.getDescription(industry, prospectsPerMonth, serviceType)}
                </p>
              </div>
              
              {index < PROCESS_STEPS.length - 1 && (
                <div className="absolute left-10 ml-6 mt-12 h-6 w-0.5 bg-gray-200 hidden md:block" />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 text-center">
            Based on our outbound datasets, most agencies see deals closing over{' '}
            <strong>2 to 12 weeks</strong> from first touch to signed client, depending on deal size and complexity.
          </p>
        </div>
      </div>
    </div>
  );
}

