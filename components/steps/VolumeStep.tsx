'use client';

import React, { useEffect } from 'react';
import { Slider } from '@/components/ui/Slider';
import { IndustryConfig, CalculationResults } from '@/types';
import { formatNumber } from '@/lib/utils/formatters';
import { calculateMaxVolume, isVolumeWithinTAM } from '@/lib/calculator/calculatorService';

interface VolumeStepProps {
  industry: IndustryConfig;
  prospectsPerMonth: number;
  calculations: CalculationResults | null;
  onProspectsChange: (prospects: number) => void;
  onRecalculate: () => void;
  maxTouchesPerBusiness: number;
  volumeMin: number;
  volumeMaxDefault: number;
}

export function VolumeStep({
  industry,
  prospectsPerMonth,
  calculations,
  onProspectsChange,
  onRecalculate,
  maxTouchesPerBusiness,
  volumeMin,
  volumeMaxDefault,
}: VolumeStepProps) {
  const maxVolume = calculateMaxVolume(
    industry.estimated_business_count,
    maxTouchesPerBusiness,
    volumeMaxDefault
  );

  const withinTAM = isVolumeWithinTAM(
    prospectsPerMonth,
    industry.estimated_business_count,
    maxTouchesPerBusiness
  );

  // Recalculate when prospects change
  useEffect(() => {
    onRecalculate();
  }, [prospectsPerMonth, onRecalculate]);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Choose your outbound volume
        </h2>
        <p className="text-gray-600">
          How many {industry.industry_plural_label} do you want us to contact each month?
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
        <Slider
          value={prospectsPerMonth}
          onChange={onProspectsChange}
          min={volumeMin}
          max={maxVolume}
          step={1000}
          formatValue={(v) => formatNumber(v)}
        />
        
        {!withinTAM && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Looks like this niche doesn&apos;t have enough local businesses to safely contact {formatNumber(prospectsPerMonth)} per month. 
              We should probably talk about neighboring niches. We can cover this on a strategy call.
            </p>
          </div>
        )}
        
        {calculations && withinTAM && (
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-700 mb-4">
              With <strong className="text-primary-600">{formatNumber(prospectsPerMonth)}</strong> {industry.industry_plural_label} contacted per month, 
              our data for {industry.industry_display_name} campaigns suggests:
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-900">
                  {calculations.leads_min} - {calculations.leads_max}
                </div>
                <div className="text-sm text-blue-700 mt-1">Leads per month</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-900">
                  {calculations.appointments_min} - {calculations.appointments_max}
                </div>
                <div className="text-sm text-green-700 mt-1">Appointments per month</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-900">
                  {calculations.clients_min} - {calculations.clients_max}
                </div>
                <div className="text-sm text-purple-700 mt-1">New clients per month</div>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
              This is an estimate based on our database, not a guarantee.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

