'use client';

import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {Array.from({ length: totalSteps }, (_, i) => i).map((step) => (
        <div
          key={step}
          className={`
            w-2 h-2 rounded-full transition-all duration-300
            ${step === currentStep 
              ? 'bg-primary-600 w-8' 
              : step < currentStep 
                ? 'bg-primary-400' 
                : 'bg-gray-300'
            }
          `}
        />
      ))}
    </div>
  );
}

