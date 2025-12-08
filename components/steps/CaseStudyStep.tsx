'use client';

import React from 'react';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { CaseStudyStrength } from '@/types';

interface CaseStudyStepProps {
  caseStudyStrength: CaseStudyStrength;
  caseStudyText: string;
  onCaseStudyStrengthChange: (strength: CaseStudyStrength) => void;
  onCaseStudyTextChange: (text: string) => void;
}

const CASE_STUDY_OPTIONS = [
  {
    value: 'none',
    label: 'No clients yet in this niche',
    description: 'You\'re just getting started with this industry'
  },
  {
    value: 'some',
    label: 'Some clients with decent results',
    description: 'You have a few clients and can show some outcomes'
  },
  {
    value: 'strong',
    label: 'Strong proven case studies',
    description: 'You have clear, compelling results for this niche'
  },
];

export function CaseStudyStep({
  caseStudyStrength,
  caseStudyText,
  onCaseStudyStrengthChange,
  onCaseStudyTextChange,
}: CaseStudyStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          How strong are your case studies?
        </h2>
        <p className="text-gray-600">
          This helps us adjust the estimates based on proof of results
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <RadioGroup
          options={CASE_STUDY_OPTIONS}
          value={caseStudyStrength}
          onChange={(value) => onCaseStudyStrengthChange(value as CaseStudyStrength)}
        />
        
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Optional: Paste one quick result you&apos;re proud of for this niche
          </label>
          <textarea
            value={caseStudyText}
            onChange={(e) => onCaseStudyTextChange(e.target.value)}
            placeholder="e.g., 'Increased organic traffic by 300% in 6 months' or 'Generated 50+ qualified leads per month'"
            rows={3}
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-sm text-gray-500">
            This is optional but helps personalize your results
          </p>
        </div>
      </div>
    </div>
  );
}

