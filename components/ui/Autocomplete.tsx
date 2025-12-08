'use client';

import React, { useState, useRef, useEffect } from 'react';
import { IndustryConfig } from '@/types';

interface AutocompleteProps {
  label?: string;
  placeholder?: string;
  options: IndustryConfig[];
  value: IndustryConfig | null;
  onChange: (option: IndustryConfig | null) => void;
  onInputChange?: (query: string) => void;
}

export function Autocomplete({ 
  label, 
  placeholder, 
  options, 
  value, 
  onChange,
  onInputChange 
}: AutocompleteProps) {
  const [query, setQuery] = useState(value?.industry_display_name || '');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query) {
      const filtered = options.filter(option =>
        option.industry_display_name.toLowerCase().includes(query.toLowerCase()) ||
        option.industry_plural_label.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [query, options]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);
    if (onInputChange) {
      onInputChange(newQuery);
    }
  };

  const handleSelect = (option: IndustryConfig) => {
    setQuery(option.industry_display_name);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="w-full" ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <button
                key={option.industry_key}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-4 py-3 text-left hover:bg-primary-50 focus:bg-primary-50 focus:outline-none transition-colors"
              >
                <div className="font-medium text-gray-900">
                  {option.industry_display_name}
                </div>
                <div className="text-sm text-gray-500">
                  ~{option.estimated_business_count.toLocaleString()} businesses
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

