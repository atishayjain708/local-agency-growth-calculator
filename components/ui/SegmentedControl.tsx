'use client';

import React from 'react';

interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  label?: string;
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ label, options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden w-full">
        {options.map((option, index) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              flex-1 px-4 py-3 text-sm font-medium transition-colors
              ${value === option.value 
                ? 'bg-primary-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
              }
              ${index > 0 ? 'border-l border-gray-300' : ''}
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

