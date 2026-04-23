import { useEffect, useMemo, useRef, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import type {
  TreeTableCellRenderer,
  TreeTableColumnDef,
  TreeTableOverlayRenderer,
} from './api-types';
import { treeTableColumns } from './columns';
import { ROW_HEIGHT_PX } from './constants';
import { TreeTableHeader } from './TreeTableHeader';
import { TreeTableRow } from './TreeTableRow';
import { cn } from '../../lib/cn';
import { treeTableCollisionDetection } from '../../features/tree-table/dnd/collision';
import { useTreeTableDnd } from '../../features/tree-table/hooks/useTreeTableDnd';
import { TreeTableDragOverlay } from '../../features/tree-table/dnd/drag-overlay';
import type { DropMode, TreeState, VisibleRow } from '../../features/tree-table/model/types';
import type { DropHintMode } from '../../features/tree-table/hooks/useTreeTable';

export interface TreeTableProps {
  state: TreeState;
  visibleRows: VisibleRow[];
  columns?: TreeTableColumnDef[];
  treeColumnId?: string;
  renderTreeCell?: TreeTableCellRenderer;
  renderDragOverlay?: TreeTableOverlayRenderer;
  virtualizationEnabled: boolean;
  dropHintMode: DropHintMode;
  overlayOpacity: number;
  containerClassName?: string;
  tableClassName?: string;
  onToggleExpand: (id: string) => void;
  onMove: (dragId: string, overId: string | null, mode: DropMode) => void;
  onDragFeedbackChange?: (message: string | null) => void;
}

export function TreeTable({
  state,
  visibleRows,
  columns = treeTableColumns,
  treeColumnId = 'tree',
  renderTreeCell,
  renderDragOverlay,
  virtualizationEnabled,
  dropHintMode,
  overlayOpacity,
  containerClassName,
  tableClassName,
  onToggleExpand,
  onMove,
  onDragFeedbackChange,
}: TreeTableProps) {
  const [focusedRowId, setFocusedRowId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: visibleRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const tableRows = table.getRowModel().rows;
  const visibleColumnCount = table.getVisibleLeafColumns().length;

  const rowVirtualizer = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => ROW_HEIGHT_PX,
    overscan: 10,
    enabled: virtualizationEnabled,
  });

  const virtualItems = virtualizationEnabled ? rowVirtualizer.getVirtualItems() : [];
  const renderedRowIndexes = virtualizationEnabled
    ? virtualItems.map((item) => item.index)
    : tableRows.map((_, index) => index);

  const paddingTop = virtualizationEnabled && virtualItems.length > 0 ? virtualItems[0].start : 0;

  const paddingBottom =
    virtualizationEnabled && virtualItems.length > 0
      ? rowVirtualizer.getTotalSize() -
        (virtualItems[virtualItems.length - 1].start + virtualItems[virtualItems.length - 1].size)
      : 0;

  const rowIds = useMemo(() => visibleRows.map((row) => row.id), [visibleRows]);

  const { sensors, activeRow, preview, onDragStart, onDragMove, onDragOver, onDragEnd, onDragCancel } =
    useTreeTableDnd({
      state,
      visibleRows,
      onMove,
    });

  useEffect(() => {
    if (!onDragFeedbackChange) {
      return;
    }

    const targetRow =
      preview.overId ? visibleRows.find((row) => row.id === preview.overId) ?? null : null;

    if (preview.isValid && preview.mode && targetRow) {
      if (preview.mode === 'inside') {
        onDragFeedbackChange(`Drop inside: "${targetRow.data.label}" becomes parent`);
        return;
      }

      if (preview.mode === 'before') {
        onDragFeedbackChange(`Drop before "${targetRow.data.label}" (same level)`);
        return;
      }

      onDragFeedbackChange(`Drop after "${targetRow.data.label}" (same level)`);
      return;
    }

    if (preview.reason && !preview.isValid) {
      onDragFeedbackChange(preview.reason);
      return;
    }

    onDragFeedbackChange(null);
  }, [onDragFeedbackChange, preview, visibleRows]);

  return (
    <DndContext
      collisionDetection={treeTableCollisionDetection}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
        <div
          ref={containerRef}
          className={cn(
            'max-h-[560px] overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm',
            containerClassName,
          )}
        >
          <table className={cn('min-w-full border-collapse', tableClassName)}>
            <TreeTableHeader headerGroups={table.getHeaderGroups()} />
            <tbody>
              {paddingTop > 0 ? (
                <tr>
                  <td colSpan={visibleColumnCount} style={{ height: `${paddingTop}px` }} />
                </tr>
              ) : null}

              {renderedRowIndexes.map((index) => {
                const tableRow = tableRows[index];

                if (!tableRow) {
                  return null;
                }

                return (
                  <TreeTableRow
                    key={tableRow.id}
                    tableRow={tableRow}
                    preview={preview}
                    treeColumnId={treeColumnId}
                    renderTreeCell={renderTreeCell}
                    onToggleExpand={onToggleExpand}
                    dropHintMode={dropHintMode}
                    focusedRowId={focusedRowId}
                    onFocusRow={setFocusedRowId}
                  />
                );
              })}

              {paddingBottom > 0 ? (
                <tr>
                  <td colSpan={visibleColumnCount} style={{ height: `${paddingBottom}px` }} />
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </SortableContext>

      <DragOverlay>
        {activeRow
          ? renderDragOverlay
            ? renderDragOverlay({ row: activeRow, overlayOpacity })
            : <TreeTableDragOverlay row={activeRow} overlayOpacity={overlayOpacity} />
          : null}
      </DragOverlay>
    </DndContext>
  );
}
