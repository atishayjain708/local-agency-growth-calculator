'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { validatePricing } from '@/lib/utils/validators';

interface PricingStepProps {
  priceLow: number;
  priceHigh: number;
  onPricingChange: (low: number, high: number) => void;
  minPrice?: number;
  maxPrice?: number;
}

export function PricingStep({ 
  priceLow, 
  priceHigh, 
  onPricingChange,
  minPrice = 200,
  maxPrice = 50000,
}: PricingStepProps) {
  const [error, setError] = useState<string | null>(null);

  const handlePriceLowChange = (value: string) => {
    const num = parseInt(value) || 0;
    onPricingChange(num, priceHigh);
    validateAndSetError(num, priceHigh);
  };

  const handlePriceHighChange = (value: string) => {
    const num = parseInt(value) || 0;
    onPricingChange(priceLow, num);
    validateAndSetError(priceLow, num);
  };

  const validateAndSetError = (low: number, high: number) => {
    const validationError = validatePricing(low, high, minPrice, maxPrice);
    setError(validationError);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          What&apos;s your pricing range?
        </h2>
        <p className="text-gray-600">
          Enter your typical monthly fee per client in this niche
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Low-end monthly fee"
            type="number"
            value={priceLow}
            onChange={(e) => handlePriceLowChange(e.target.value)}
            placeholder="1000"
            min={minPrice}
            max={maxPrice}
          />
          
          <Input
            label="High-end monthly fee"
            type="number"
            value={priceHigh}
            onChange={(e) => handlePriceHighChange(e.target.value)}
            placeholder="3000"
            min={minPrice}
            max={maxPrice}
          />
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Tip:</strong> Enter the range you typically charge for monthly retainers or ongoing services. This helps us calculate potential MRR accurately.
          </p>
        </div>
      </div>
    </div>
  );
}

