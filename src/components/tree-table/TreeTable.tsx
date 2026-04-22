import { useEffect, useMemo, useRef, useState } from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';

import { treeTableColumns } from './columns';
import { ROW_HEIGHT_PX } from './constants';
import { TreeTableHeader } from './TreeTableHeader';
import { TreeTableRow } from './TreeTableRow';
import { useTreeTableDnd } from '../../features/tree-table/hooks/useTreeTableDnd';
import { TreeTableDragOverlay } from '../../features/tree-table/dnd/drag-overlay';
import type { DropMode, TreeState, VisibleRow } from '../../features/tree-table/model/types';

interface TreeTableProps {
  state: TreeState;
  visibleRows: VisibleRow[];
  virtualizationEnabled: boolean;
  showDropZones: boolean;
  onToggleExpand: (id: string) => void;
  onMove: (dragId: string, overId: string | null, mode: DropMode) => void;
  onDragFeedbackChange?: (message: string | null) => void;
}

export function TreeTable({
  state,
  visibleRows,
  virtualizationEnabled,
  showDropZones,
  onToggleExpand,
  onMove,
  onDragFeedbackChange,
}: TreeTableProps) {
  const [focusedRowId, setFocusedRowId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: visibleRows,
    columns: treeTableColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const tableRows = table.getRowModel().rows;

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

  const { sensors, activeRow, preview, onDragStart, onDragOver, onDragEnd, onDragCancel } =
    useTreeTableDnd({
      state,
      visibleRows,
      onMove,
    });

  useEffect(() => {
    if (!onDragFeedbackChange) {
      return;
    }

    if (preview.reason && !preview.isValid) {
      onDragFeedbackChange(preview.reason);
      return;
    }

    onDragFeedbackChange(null);
  }, [onDragFeedbackChange, preview]);

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
        <div
          ref={containerRef}
          className="max-h-[560px] overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <table className="min-w-full border-collapse">
            <TreeTableHeader headerGroups={table.getHeaderGroups()} />
            <tbody>
              {paddingTop > 0 ? (
                <tr>
                  <td colSpan={treeTableColumns.length} style={{ height: `${paddingTop}px` }} />
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
                    onToggleExpand={onToggleExpand}
                    showDropZones={showDropZones}
                    focusedRowId={focusedRowId}
                    onFocusRow={setFocusedRowId}
                  />
                );
              })}

              {paddingBottom > 0 ? (
                <tr>
                  <td colSpan={treeTableColumns.length} style={{ height: `${paddingBottom}px` }} />
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </SortableContext>

      <DragOverlay>{activeRow ? <TreeTableDragOverlay row={activeRow} /> : null}</DragOverlay>
    </DndContext>
  );
}
