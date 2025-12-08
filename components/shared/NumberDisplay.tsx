import React from 'react';

interface NumberDisplayProps {
  label: string;
  value: string | number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success';
}

export function NumberDisplay({ label, value, size = 'md', variant = 'default' }: NumberDisplayProps) {
  const sizeStyles = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl md:text-5xl',
  };

  const variantStyles = {
    default: 'text-gray-900',
    primary: 'text-primary-600',
    success: 'text-green-600',
  };

  return (
    <div className="text-center">
      <div className={`font-bold ${sizeStyles[size]} ${variantStyles[variant]}`}>
        {value}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {label}
      </div>
    </div>
  );
}

