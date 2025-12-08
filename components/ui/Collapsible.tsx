'use client';

import React from 'react';
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

interface CollapsibleProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Collapsible({ trigger, children, defaultOpen = false }: CollapsibleProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <CollapsiblePrimitive.Root open={open} onOpenChange={setOpen}>
      <CollapsiblePrimitive.Trigger asChild>
        <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm focus:outline-none focus:underline">
          {trigger}
          <span className={`transform transition-transform ${open ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </CollapsiblePrimitive.Trigger>
      
      <CollapsiblePrimitive.Content className="mt-4 overflow-hidden data-[state=closed]:animate-[slideUp_0.2s_ease-out] data-[state=open]:animate-[slideDown_0.2s_ease-out]">
        {children}
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}

