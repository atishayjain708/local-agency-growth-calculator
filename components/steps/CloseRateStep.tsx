'use client';

import React from 'react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';

interface CloseRateStepProps {
  closeRate: number;
  onCloseRateChange: (rate: number) => void;
}

const CLOSE_RATE_OPTIONS = [
  { value: '0.1', label: '10%' },
  { value: '0.2', label: '20%' },
  { value: '0.3', label: '30%' },
  { value: '0.4', label: '40%' },
];

export function CloseRateStep({ closeRate, onCloseRateChange }: CloseRateStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          What&apos;s your close rate?
        </h2>
        <p className="text-gray-600">
          When you get a qualified sales call booked, what percent do you usually close?
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <SegmentedControl
          label="Select your typical close rate"
          options={CLOSE_RATE_OPTIONS}
          value={closeRate.toString()}
          onChange={(value) => onCloseRateChange(parseFloat(value))}
        />
        
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why this matters</h3>
              <p className="text-sm text-gray-600">
                We use your self-reported close rate to calculate how many new clients you can realistically sign from the appointments we generate. Most agencies close between 20-30% of qualified calls.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

