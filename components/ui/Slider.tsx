'use client';

import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

interface SliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
  helperText?: string;
}

export function Slider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  formatValue = (v) => v.toString(),
  helperText 
}: SliderProps) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <span className="text-lg font-semibold text-primary-600">
            {formatValue(value)}
          </span>
        </div>
      )}
      
      <SliderPrimitive.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
      >
        <SliderPrimitive.Track className="bg-gray-200 relative grow rounded-full h-2">
          <SliderPrimitive.Range className="absolute bg-primary-600 rounded-full h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb 
          className="block w-6 h-6 bg-white border-2 border-primary-600 rounded-full shadow-lg hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label={label}
        />
      </SliderPrimitive.Root>
      
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
      
      {helperText && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

