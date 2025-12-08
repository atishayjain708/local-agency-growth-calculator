'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Collapsible } from '@/components/ui/Collapsible';
import { 
  IndustryConfig, 
  ServiceType, 
  CalculationResults,
} from '@/types';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils/formatters';

interface ResultsStepProps {
  industry: IndustryConfig;
  serviceType: ServiceType;
  prospectsPerMonth: number;
  closeRate: number;
  priceLow: number;
  priceHigh: number;
  capacity: number;
  calculations: CalculationResults;
  calendlyUrl: string;
}

export function ResultsStep({
  industry,
  serviceType,
  prospectsPerMonth,
  closeRate,
  priceLow,
  priceHigh,
  capacity,
  calculations,
  calendlyUrl,
}: ResultsStepProps) {
  const showCapacityWarning = calculations.appointments_max > capacity * 1.5;
  
  const buildCalendlyUrl = () => {
    const params = new URLSearchParams({
      industry: industry.industry_key,
      service_type: serviceType,
      prospects: prospectsPerMonth.toString(),
      leads_range: `${calculations.leads_min}-${calculations.leads_max}`,
      appointments_range: `${calculations.appointments_min}-${calculations.appointments_max}`,
      clients_range: `${calculations.clients_min}-${calculations.clients_max}`,
      price_low: priceLow.toString(),
      price_high: priceHigh.toString(),
      close_rate: closeRate.toString(),
    });
    return `${calendlyUrl}?${params.toString()}`;
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Here&apos;s what this can add to your agency each month
        </h2>
      </div>
      
      {/* Input Echo */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-sm text-gray-700">
        For a <strong>{serviceType}</strong> agency targeting <strong>{industry.industry_plural_label}</strong>, 
        contacting <strong>{formatNumber(prospectsPerMonth)}</strong> local businesses per month, 
        with your close rate of <strong>{formatPercentage(closeRate)}</strong> and pricing of{' '}
        <strong>{formatCurrency(priceLow)} to {formatCurrency(priceHigh)}</strong> per client, 
        here&apos;s a realistic outcome based on our database.
      </div>
      
      {/* Funnel Numbers */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Pipeline Numbers</h3>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Prospects contacted</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(prospectsPerMonth)} <span className="text-sm font-normal text-gray-500">/month</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Leads</div>
            <div className="text-2xl font-bold text-blue-600">
              {calculations.leads_min} - {calculations.leads_max} <span className="text-sm font-normal text-gray-500">/month</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Booked appointments</div>
            <div className="text-2xl font-bold text-green-600">
              {calculations.appointments_min} - {calculations.appointments_max} <span className="text-sm font-normal text-gray-500">/month</span>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">New clients signed</div>
            <div className="text-2xl font-bold text-purple-600">
              {calculations.clients_min} - {calculations.clients_max} <span className="text-sm font-normal text-gray-500">/month</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Using your {formatPercentage(closeRate)} close rate
            </div>
          </div>
        </div>
        
        {showCapacityWarning && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> You told us you can handle about <strong>{capacity}</strong> new sales calls per month. 
              At this volume we expect <strong>{calculations.appointments_min} to {calculations.appointments_max}</strong>. 
              That&apos;s fine — we can throttle or prioritize the strongest opportunities so you&apos;re not overwhelmed.
            </p>
          </div>
        )}
      </div>
      
      {/* Revenue Impact */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-6 md:p-8 space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Revenue Impact</h3>
        
        <div className="space-y-3">
          <p className="text-gray-700">
            Based on your pricing of <strong>{formatCurrency(priceLow)} to {formatCurrency(priceHigh)}</strong> per month per client, 
            this volume can realistically add:
          </p>
          
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-4xl md:text-5xl font-bold text-green-600">
              {formatCurrency(calculations.mrr_low)} - {formatCurrency(calculations.mrr_high)}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              in new monthly recurring revenue
            </div>
            <p className="text-xs text-gray-500 mt-2">
              once the pipeline has ramped and deals from these appointments start to close
            </p>
          </div>
          
          <div className="bg-white bg-opacity-50 rounded-lg p-4 text-center">
            <div className="text-gray-700">
              On a yearly basis that&apos;s roughly
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
              {formatCurrency(calculations.annual_low)} - {formatCurrency(calculations.annual_high)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              in extra revenue from this niche alone, assuming stable performance
            </div>
          </div>
        </div>
      </div>
      
      {/* Calculation Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <Collapsible trigger="Show how we calculated these estimates">
          <div className="space-y-3 text-sm text-gray-700">
            <p>• You chose <strong>{formatNumber(prospectsPerMonth)}</strong> prospects per month.</p>
            <p>• For {industry.industry_display_name}, our dataset shows about <strong>1 lead per {Math.round(calculations.pcpl_min_adj)} to {Math.round(calculations.pcpl_max_adj)} prospects</strong>.</p>
            <p>• For this estimate we used a mid-point of <strong>1 lead per {Math.round(calculations.pcpl_mid)} prospects</strong>.</p>
            <p>• So at {formatNumber(prospectsPerMonth)} prospects, that&apos;s roughly <strong>{calculations.leads_mid} leads per month</strong>.</p>
            <p>• About <strong>40%</strong> of those leads usually book a call, so that&apos;s <strong>{calculations.appointments_mid} appointments per month</strong>.</p>
            <p>• You told us you close about <strong>{formatPercentage(closeRate)}</strong> of qualified calls, which gives about <strong>{calculations.clients_mid} new clients per month</strong>.</p>
            <p>• With your pricing of <strong>{formatCurrency(priceLow)} to {formatCurrency(priceHigh)}</strong>, that&apos;s <strong>{formatCurrency(calculations.mrr_low)} to {formatCurrency(calculations.mrr_high)}</strong> in new MRR.</p>
            
            <div className="pt-3 mt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 italic">
                These are estimates from our historical data, not a guarantee for your agency.
              </p>
            </div>
          </div>
        </Collapsible>
      </div>
      
      {/* CTA */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl shadow-xl p-6 md:p-8 text-center text-white">
        <h3 className="text-2xl md:text-3xl font-bold mb-3">
          Want us to walk through these numbers one-to-one?
        </h3>
        <p className="text-primary-100 mb-6">
          Let&apos;s stress test them for your agency and discuss how we can help you hit these targets.
        </p>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => window.open(buildCalendlyUrl(), '_blank')}
          className="bg-white text-primary-600 hover:bg-gray-50"
        >
          Book a strategy call
        </Button>
      </div>
    </div>
  );
}

