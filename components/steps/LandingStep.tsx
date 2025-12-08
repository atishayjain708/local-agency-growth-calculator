'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface LandingStepProps {
  onStart: () => void;
}

export function LandingStep({ onStart }: LandingStepProps) {
  return (
    <div className="text-center space-y-8 py-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          See how many new local clients you can realistically add each month
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          In 2 to 3 minutes, we will run your niche through our outbound dataset and show you a realistic range of leads, appointments and clients, based on your pricing and close rate.
        </p>
      </div>
      
      <div className="pt-8">
        <Button 
          variant="primary" 
          size="lg"
          onClick={onStart}
          className="min-w-64"
        >
          Start the calculator
        </Button>
      </div>
      
      <div className="pt-12">
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>2-3 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Data-driven estimates</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Transparent calculations</span>
          </div>
        </div>
      </div>
    </div>
  );
}

