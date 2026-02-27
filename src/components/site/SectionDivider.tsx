import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function SectionDivider() {
  return (
    <div className="relative py-12">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-4 text-zinc-400 dark:bg-black dark:text-zinc-600">
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </span>
      </div>
    </div>
  );
}
