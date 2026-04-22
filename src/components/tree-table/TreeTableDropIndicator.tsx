import { cva } from 'class-variance-authority';

import { cn } from '../../lib/cn';
import type { DropMode } from '../../features/tree-table/model/types';

const dropIndicatorVariants = cva('absolute inset-x-0 pointer-events-none z-10', {
  variants: {
    mode: {
      before: 'top-0 border-t-2',
      after: 'bottom-0 border-b-2',
      inside: 'inset-y-0 border-2 rounded-sm',
    },
    valid: {
      true: 'border-emerald-500 bg-emerald-50/40',
      false: 'border-rose-500 bg-rose-50/40',
    },
  },
});

interface TreeTableDropIndicatorProps {
  mode: DropMode;
  valid: boolean;
}

export function TreeTableDropIndicator({ mode, valid }: TreeTableDropIndicatorProps) {
  return <div className={cn(dropIndicatorVariants({ mode, valid }))} aria-hidden="true" />;
}
