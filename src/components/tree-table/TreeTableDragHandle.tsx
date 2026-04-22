import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import * as Tooltip from '@radix-ui/react-tooltip';

import { cn } from '../../lib/cn';

interface TreeTableDragHandleProps {
  disabled?: boolean;
  attributes: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
  setActivatorNodeRef: (element: HTMLElement | null) => void;
}

export function TreeTableDragHandle({
  disabled,
  attributes,
  listeners,
  setActivatorNodeRef,
}: TreeTableDragHandleProps) {
  return (
    <Tooltip.Provider delayDuration={250}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            ref={setActivatorNodeRef}
            type="button"
            className={cn(
              'grid h-6 w-6 place-items-center rounded border border-slate-300 bg-white text-slate-500 transition',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2',
              disabled
                ? 'cursor-not-allowed opacity-40'
                : 'cursor-grab hover:border-slate-400 hover:text-slate-700 active:cursor-grabbing',
            )}
            aria-label="Drag row"
            disabled={disabled}
            {...attributes}
            {...listeners}
          >
            <span className="text-xs leading-none">⋮⋮</span>
          </button>
        </Tooltip.Trigger>
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
