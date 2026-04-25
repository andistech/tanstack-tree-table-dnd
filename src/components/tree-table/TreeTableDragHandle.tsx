import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

import { cn } from '../../lib/cn';

interface TreeTableDragHandleProps {
  disabled?: boolean;
  showTooltip?: boolean;
  attributes: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
  setActivatorNodeRef: (element: HTMLElement | null) => void;
}

export function TreeTableDragHandle({
  disabled,
  showTooltip = true,
  attributes,
  listeners,
  setActivatorNodeRef,
}: TreeTableDragHandleProps) {
  const button = (
    <button
      ref={setActivatorNodeRef}
      type="button"
      className={cn(
        'grid h-7 w-7 place-items-center rounded-md text-slate-500 transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
        disabled
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-grab hover:bg-slate-100 hover:text-slate-700 active:cursor-grabbing',
      )}
      aria-label="Drag row"
      disabled={disabled}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4" aria-hidden="true" />
    </button>
  );

  if (!showTooltip) {
    return button;
  }

  return (
    <Tooltip.Provider delayDuration={250}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={6}
            className="rounded border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-lg"
          >
            Drag to reorder or reparent
            <Tooltip.Arrow className="fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
