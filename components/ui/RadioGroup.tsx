'use client';

import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
}

export function RadioGroup({ label, options, value, onChange }: RadioGroupProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}
      
      <RadioGroupPrimitive.Root
        value={value}
        onValueChange={onChange}
        className="flex flex-col space-y-3"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <RadioGroupPrimitive.Item
              value={option.value}
              id={option.value}
              className="w-5 h-5 rounded-full border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600 mt-0.5"
            >
              <RadioGroupPrimitive.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-2 after:h-2 after:rounded-full after:bg-white" />
            </RadioGroupPrimitive.Item>
            <label
              htmlFor={option.value}
              className="ml-3 cursor-pointer"
            >
              <span className="block text-base font-medium text-gray-900">
                {option.label}
              </span>
              {option.description && (
                <span className="block text-sm text-gray-500 mt-1">
                  {option.description}
                </span>
              )}
            </label>
          </div>
        ))}
      </RadioGroupPrimitive.Root>
    </div>
  );
}

