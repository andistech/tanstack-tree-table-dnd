import { cva } from 'class-variance-authority';

import { cn } from '../../lib/cn';
import type { DropMode } from '../../features/tree-table/model/types';

const dropIndicatorVariants = cva('pointer-events-none absolute inset-x-0 z-10', {
  variants: {
    mode: {
      before: 'top-0 border-t-2',
      after: 'bottom-0 border-b-2',
      inside: 'inset-y-0 rounded-sm border-2',
    },
    valid: {
      true: '',
      false: 'border-rose-500 bg-rose-50/40',
    },
  },
  compoundVariants: [
    {
      mode: 'inside',
      valid: true,
      className: 'border-emerald-500 bg-emerald-100/40',
    },
    {
      mode: 'before',
      valid: true,
      className: 'border-cyan-500',
    },
    {
      mode: 'after',
      valid: true,
      className: 'border-cyan-500',
    },
  ],
});

interface TreeTableDropIndicatorProps {
  mode: DropMode;
  valid: boolean;
}

export function TreeTableDropIndicator({ mode, valid }: TreeTableDropIndicatorProps) {
  return <div className={cn(dropIndicatorVariants({ mode, valid }))} aria-hidden="true" />;
}
