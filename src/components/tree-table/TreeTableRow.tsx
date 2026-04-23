import { useSortable } from '@dnd-kit/sortable';
import { cva } from 'class-variance-authority';
import { flexRender, type Row } from '@tanstack/react-table';

import { TreeTableCell } from './TreeTableCell';
import { TreeTableDropIndicator } from './TreeTableDropIndicator';
import { cn } from '../../lib/cn';
import type { DndPreviewState } from '../../features/tree-table/dnd/dnd-types';
import type { VisibleRow } from '../../features/tree-table/model/types';
import type { DropHintMode } from '../../features/tree-table/hooks/useTreeTable';

const rowVariants = cva('border-b border-slate-200 text-sm transition-colors', {
  variants: {
    state: {
      default: 'bg-white hover:bg-amber-50/40',
      dragging: 'opacity-50',
      focused: 'bg-amber-50/60',
      invalid: 'bg-rose-50/70',
      dropInsideValid: 'bg-emerald-50 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.55)]',
      dropInsideMinimal: 'bg-emerald-50',
      dropSiblingValid: 'bg-cyan-50/70',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

interface TreeTableRowProps {
  tableRow: Row<VisibleRow>;
  preview: DndPreviewState;
  onToggleExpand: (id: string) => void;
  dropHintMode: DropHintMode;
  focusedRowId: string | null;
  onFocusRow: (id: string) => void;
}

export function TreeTableRow({
  tableRow,
  preview,
  onToggleExpand,
  dropHintMode,
  focusedRowId,
  onFocusRow,
}: TreeTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    isDragging,
  } = useSortable({
    id: tableRow.original.id,
    disabled: Boolean(tableRow.original.data.isDisabled),
  });

  const isDropTarget = preview.overId === tableRow.original.id;
  const suppressInsideBorder = dropHintMode === 'minimal' && preview.mode === 'inside';
  const showMinimalBeforeLine =
    dropHintMode === 'minimal' && isDropTarget && preview.isValid && preview.mode === 'before';
  const showMinimalAfterLine =
    dropHintMode === 'minimal' && isDropTarget && preview.isValid && preview.mode === 'after';
  const stateVariant =
    !preview.isValid && isDropTarget
      ? 'invalid'
      : preview.isValid && isDropTarget && preview.mode === 'inside' && dropHintMode === 'minimal'
        ? 'dropInsideMinimal'
        : preview.isValid && isDropTarget && preview.mode === 'inside'
          ? 'dropInsideValid'
        : preview.isValid && isDropTarget && preview.mode
          ? 'dropSiblingValid'
          : isDragging
            ? 'dragging'
            : focusedRowId === tableRow.original.id
              ? 'focused'
              : 'default';

  return (
    <tr
      ref={setNodeRef}
      className={cn(rowVariants({ state: stateVariant }))}
      data-drop-mode={isDropTarget ? preview.mode ?? undefined : undefined}
      tabIndex={0}
      onFocus={() => onFocusRow(tableRow.original.id)}
    >
      {tableRow.getVisibleCells().map((cell) => {
        if (cell.column.id === 'tree') {
          return (
            <td
              key={cell.id}
              className={cn(
                'relative min-w-[360px] px-2 py-0',
                showMinimalBeforeLine && 'border-t-2 border-cyan-500',
                showMinimalAfterLine && 'border-b-2 border-cyan-500',
              )}
            >
              {isDropTarget && preview.mode && dropHintMode !== 'minimal' && !suppressInsideBorder ? (
                <TreeTableDropIndicator mode={preview.mode} valid={preview.isValid} />
              ) : null}
              {isDropTarget && preview.mode && preview.isValid && dropHintMode === 'labels' ? (
                <span
                  className={cn(
                    'pointer-events-none absolute right-2 top-1 z-20 rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                    preview.mode === 'inside'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-cyan-700 text-white',
                  )}
                >
                  {preview.mode === 'inside'
                    ? 'Will become parent'
                    : preview.mode === 'before'
                      ? 'Insert above'
                      : 'Insert below'}
                </span>
              ) : null}
              <TreeTableCell
                row={tableRow.original}
                onToggleExpand={onToggleExpand}
                handle={{
                  attributes,
                  listeners,
                  setActivatorNodeRef,
                }}
              />
            </td>
          );
        }

        return (
          <td
            key={cell.id}
            className={cn(
              'px-3 py-2 text-slate-700',
              showMinimalBeforeLine && 'border-t-2 border-cyan-500',
              showMinimalAfterLine && 'border-b-2 border-cyan-500',
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}
