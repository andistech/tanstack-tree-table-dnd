import { ChevronRightIcon } from './icons';
import { INDENT_PX } from './constants';
import { TreeTableDragHandle } from './TreeTableDragHandle';
import { cn } from '../../lib/cn';
import type { VisibleRow } from '../../features/tree-table/model/types';
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';

interface TreeTableCellProps {
  row: VisibleRow;
  onToggleExpand: (id: string) => void;
  dragHandleTooltipsEnabled: boolean;
  handle: {
    attributes: DraggableAttributes;
    listeners?: DraggableSyntheticListeners;
    setActivatorNodeRef: (element: HTMLElement | null) => void;
  };
}

function NodeIcon({ kind }: { kind: VisibleRow['data']['kind'] }) {
  return (
    <span
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded text-[10px] font-semibold uppercase',
        kind === 'group' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600',
      )}
      aria-hidden="true"
    >
      {kind === 'group' ? 'G' : 'I'}
    </span>
  );
}

export function TreeTableCell({
  row,
  onToggleExpand,
  dragHandleTooltipsEnabled,
  handle,
}: TreeTableCellProps) {
  const leftPadding = row.depth * INDENT_PX;

  return (
    <div className="relative flex items-center gap-2 py-2" style={{ paddingLeft: `${leftPadding}px` }}>
      <TreeTableDragHandle
        disabled={row.data.isDisabled}
        showTooltip={dragHandleTooltipsEnabled}
        attributes={handle.attributes}
        listeners={handle.listeners}
        setActivatorNodeRef={handle.setActivatorNodeRef}
      />

      {row.hasChildren ? (
        <button
          type="button"
          className="grid h-6 w-6 place-items-center rounded border border-transparent text-slate-500 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-expanded={row.isExpanded}
          aria-label={row.isExpanded ? 'Collapse row' : 'Expand row'}
          onClick={() => onToggleExpand(row.id)}
        >
          <ChevronRightIcon className={cn('h-4 w-4 transition-transform', row.isExpanded && 'rotate-90')} />
        </button>
      ) : (
        <span className="inline-block h-6 w-6" aria-hidden="true" />
      )}

      <NodeIcon kind={row.data.kind} />
      <span className={cn('truncate', row.data.isDisabled && 'text-slate-400 line-through')}>
        {row.data.label}
      </span>
    </div>
  );
}
