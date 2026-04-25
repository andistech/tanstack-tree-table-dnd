import type { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { cva } from 'class-variance-authority';
import { flexRender, type Row } from '@tanstack/react-table';

import type { TreeTableCellRenderer, TreeTableColumnMeta } from './api-types';
import { TreeTableCell } from './TreeTableCell';
import { cn } from '../../lib/cn';
import type { DndPreviewState } from '../../features/tree-table/dnd/dnd-types';
import type { VisibleRow } from '../../features/tree-table/model/types';
import type {
  DropHintMode,
  DragHandleAlignment,
} from '../../features/tree-table/hooks/useTreeTable';

const rowVariants = cva('border-b border-slate-200 text-sm transition-colors', {
  variants: {
    state: {
      default: 'bg-white hover:bg-slate-50/70',
      dragging: 'opacity-50',
      focused: 'bg-slate-100/70',
      invalid: 'bg-rose-50/70',
      dropInsideValid: 'bg-emerald-50 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.55)]',
      dropInsideMinimal: 'bg-emerald-50',
      dropInsideGray: 'bg-slate-300/70',
      dropSiblingValid: 'bg-cyan-50/70',
      dropSiblingGray: 'bg-slate-100',
      dropInvalidGray: 'bg-slate-100',
    },
  },
  defaultVariants: {
    state: 'default',
  },
});

interface TreeTableRowProps {
  tableRow: Row<VisibleRow>;
  preview: DndPreviewState;
  treeColumnId: string;
  renderTreeCell?: TreeTableCellRenderer;
  onToggleExpand: (id: string) => void;
  dropHintMode: DropHintMode;
  dragHandleTooltipsEnabled: boolean;
  dragHandlesHoverOnly: boolean;
  dragHandleAlignment: DragHandleAlignment;
  focusedRowId: string | null;
  onFocusRow: (id: string) => void;
}

export function TreeTableRow({
  tableRow,
  preview,
  treeColumnId,
  renderTreeCell,
  onToggleExpand,
  dropHintMode,
  dragHandleTooltipsEnabled,
  dragHandlesHoverOnly,
  dragHandleAlignment,
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
  const shouldRenderBoxIndicator = dropHintMode === 'off' || dropHintMode === 'labels';
  const showBoxBefore = shouldRenderBoxIndicator && isDropTarget && preview.mode === 'before';
  const showBoxAfter = shouldRenderBoxIndicator && isDropTarget && preview.mode === 'after';
  const showBoxInside = shouldRenderBoxIndicator && isDropTarget && preview.mode === 'inside';
  const boxBorderColorClass =
    preview.isValid && preview.mode === 'inside'
      ? 'border-emerald-500'
      : preview.isValid
        ? 'border-cyan-500'
        : 'border-rose-500';
  const showMinimalBeforeLine =
    dropHintMode === 'minimal' && isDropTarget && preview.isValid && preview.mode === 'before';
  const showMinimalAfterLine =
    dropHintMode === 'minimal' && isDropTarget && preview.isValid && preview.mode === 'after';
  const showGrayBeforeLine =
    dropHintMode === 'gray' && isDropTarget && preview.isValid && preview.mode === 'before';
  const showGrayAfterLine =
    dropHintMode === 'gray' && isDropTarget && preview.isValid && preview.mode === 'after';
  const shouldHatchGrayInvalid = dropHintMode === 'gray' && isDropTarget && !preview.isValid;
  const stateVariant =
    shouldHatchGrayInvalid
      ? 'dropInvalidGray'
      : !preview.isValid && isDropTarget
      ? 'invalid'
      : preview.isValid && isDropTarget && preview.mode === 'inside' && dropHintMode === 'gray'
        ? 'dropInsideGray'
      : preview.isValid && isDropTarget && preview.mode === 'inside' && dropHintMode === 'minimal'
        ? 'dropInsideMinimal'
        : preview.isValid && isDropTarget && preview.mode === 'inside'
          ? 'dropInsideValid'
        : preview.isValid && isDropTarget && preview.mode && dropHintMode === 'gray'
          ? 'dropSiblingGray'
        : preview.isValid && isDropTarget && preview.mode
          ? 'dropSiblingValid'
          : isDragging
            ? 'dragging'
            : focusedRowId === tableRow.original.id
              ? 'focused'
              : 'default';
  const grayInvalidHatchStyle: CSSProperties | undefined = shouldHatchGrayInvalid
    ? {
        backgroundImage:
          'repeating-linear-gradient(45deg, rgba(51,65,85,0.18) 0, rgba(51,65,85,0.18) 8px, rgba(241,245,249,0.82) 8px, rgba(241,245,249,0.82) 16px)',
      }
    : undefined;

  return (
    <tr
      ref={setNodeRef}
      className={cn('group', rowVariants({ state: stateVariant }))}
      style={grayInvalidHatchStyle}
      data-drop-mode={isDropTarget ? preview.mode ?? undefined : undefined}
      tabIndex={0}
      onFocus={() => onFocusRow(tableRow.original.id)}
    >
      {tableRow.getVisibleCells().map((cell, cellIndex, cells) => {
        const meta = cell.column.columnDef.meta as TreeTableColumnMeta | undefined;
        const handleBindings = {
          attributes,
          listeners,
          setActivatorNodeRef,
        };

        if (cell.column.id === treeColumnId) {
          return (
            <td
              key={cell.id}
              className={cn(
                'relative min-w-[360px] px-4 py-0 align-middle',
                meta?.cellClassName,
                showBoxBefore && 'border-t-2',
                showBoxAfter && 'border-b-2',
                (showBoxBefore || showBoxAfter) && boxBorderColorClass,
                showBoxInside && 'border-y-2',
                showBoxInside && boxBorderColorClass,
                showBoxInside && cellIndex === 0 && 'rounded-l-sm border-l-2',
                showBoxInside && cellIndex === cells.length - 1 && 'rounded-r-sm border-r-2',
                showMinimalBeforeLine && 'border-t-2 border-cyan-500',
                showMinimalAfterLine && 'border-b-2 border-cyan-500',
                showGrayBeforeLine && 'border-t-2 border-slate-500',
                showGrayAfterLine && 'border-b-2 border-slate-500',
              )}
            >
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
              {renderTreeCell
                ? renderTreeCell({
                    row: tableRow.original,
                    onToggleExpand,
                    handle: handleBindings,
                  })
                : (
                    <TreeTableCell
                      row={tableRow.original}
                      onToggleExpand={onToggleExpand}
                      handle={handleBindings}
                      dragHandleTooltipsEnabled={dragHandleTooltipsEnabled}
                      dragHandlesHoverOnly={dragHandlesHoverOnly}
                      dragHandleAlignment={dragHandleAlignment}
                    />
                  )}
            </td>
          );
        }

        return (
          <td
            key={cell.id}
            className={cn(
              'px-4 py-2 align-middle text-slate-700',
              meta?.cellClassName,
              showBoxBefore && 'border-t-2',
              showBoxAfter && 'border-b-2',
              (showBoxBefore || showBoxAfter) && boxBorderColorClass,
              showBoxInside && 'border-y-2',
              showBoxInside && boxBorderColorClass,
              showBoxInside && cellIndex === 0 && 'rounded-l-sm border-l-2',
              showBoxInside && cellIndex === cells.length - 1 && 'rounded-r-sm border-r-2',
              showMinimalBeforeLine && 'border-t-2 border-cyan-500',
              showMinimalAfterLine && 'border-b-2 border-cyan-500',
              showGrayBeforeLine && 'border-t-2 border-slate-500',
              showGrayAfterLine && 'border-b-2 border-slate-500',
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        );
      })}
    </tr>
  );
}
