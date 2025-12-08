'use client';

import React from 'react';
import { Slider } from '@/components/ui/Slider';

interface CapacityStepProps {
  capacity: number;
  onCapacityChange: (capacity: number) => void;
  minCapacity: number;
  maxCapacity: number;
}

export function CapacityStep({
  capacity,
  onCapacityChange,
  minCapacity,
  maxCapacity,
}: CapacityStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          What&apos;s your sales capacity?
        </h2>
        <p className="text-gray-600">
          How many new sales calls can you or your team realistically handle per month?
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <Slider
          value={capacity}
          onChange={onCapacityChange}
          min={minCapacity}
          max={maxCapacity}
          step={1}
          formatValue={(v) => `${v} calls`}
        />
        
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why we ask this</h3>
              <p className="text-sm text-gray-600">
                We want to make sure the volume of appointments we generate matches your ability to take calls. 
                If we project more appointments than you can handle, we&apos;ll throttle or prioritize the strongest opportunities so you&apos;re not overwhelmed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

