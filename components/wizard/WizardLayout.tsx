'use client';

import React from 'react';
import { ProgressIndicator } from './ProgressIndicator';
import { Button } from '@/components/ui/Button';

interface WizardLayoutProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  nextLabel?: string;
  prevLabel?: string;
  showNext?: boolean;
  showPrev?: boolean;
  nextDisabled?: boolean;
}

export function WizardLayout({
  currentStep,
  totalSteps,
  children,
  onNext,
  onPrev,
  nextLabel = 'Next',
  prevLabel = 'Back',
  showNext = true,
  showPrev = true,
  nextDisabled = false,
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Progress indicator - only show after landing page */}
      {currentStep > 0 && (
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="max-w-3xl mx-auto px-4">
            <ProgressIndicator currentStep={currentStep - 1} totalSteps={totalSteps - 1} />
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </div>
        
        {/* Navigation buttons */}
        {(showNext || showPrev) && currentStep > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4 sm:py-6">
            <div className="max-w-2xl mx-auto flex gap-3 justify-between">
              {showPrev && currentStep > 1 ? (
                <Button
                  variant="secondary"
                  onClick={onPrev}
                  className="w-32"
                >
                  {prevLabel}
                </Button>
              ) : (
                <div /> /* Spacer */
              )}
              
              {showNext && (
                <Button
                  variant="primary"
                  onClick={onNext}
                  disabled={nextDisabled}
                  className="w-32 sm:w-auto"
                >
                  {nextLabel}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

