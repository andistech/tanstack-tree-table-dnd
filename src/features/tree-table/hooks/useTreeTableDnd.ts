import { useMemo, useState } from 'react';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';

import {
  DROP_INSIDE_ZONE_RATIO_DROPPABLE,
  DROP_INSIDE_ZONE_RATIO_NON_DROPPABLE,
} from '../../../components/tree-table/constants';
import { resolveDropModeFromRects } from '../dnd/collision';
import { useTreeTableSensors } from '../dnd/sensors';
import { resolveDrop } from '../model/resolve-drop';
import { canNodeHaveChildren } from '../model/tree-selectors';
import { validateMove } from '../model/validation';
import type { DndPreviewState } from '../dnd/dnd-types';
import type { DropMode, TreeState, VisibleRow } from '../model/types';

interface UseTreeTableDndArgs {
  state: TreeState;
  visibleRows: VisibleRow[];
  onMove: (dragId: string, overId: string | null, mode: DropMode) => void;
}

const initialPreview: DndPreviewState = {
  overId: null,
  mode: null,
  isValid: true,
};

function toRowId(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

export function useTreeTableDnd({ state, visibleRows, onMove }: UseTreeTableDndArgs) {
  const sensors = useTreeTableSensors();
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [preview, setPreview] = useState<DndPreviewState>(initialPreview);

  const activeRow = useMemo(
    () => visibleRows.find((row) => row.id === activeDragId) ?? null,
    [activeDragId, visibleRows],
  );

  function onDragStart(event: DragStartEvent): void {
    setActiveDragId(toRowId(event.active.id));
  }

  function onDragOver(event: DragOverEvent): void {
    const dragId = activeDragId;
    if (!dragId) {
      setPreview(initialPreview);
      return;
    }

    const overId = toRowId(event.over?.id);
    if (!overId) {
      setPreview({
        overId: null,
        mode: null,
        isValid: false,
        reason: 'Drop target missing',
      });
      return;
    }

    const activeRect = event.active.rect.current.translated ?? event.active.rect.current.initial ?? null;
    const overRect = event.over?.rect ?? null;
    const overNode = state.nodesById[overId];
    const insideZoneRatio =
      overNode && canNodeHaveChildren(overNode)
        ? DROP_INSIDE_ZONE_RATIO_DROPPABLE
        : DROP_INSIDE_ZONE_RATIO_NON_DROPPABLE;
    const mode = resolveDropModeFromRects(activeRect, overRect, insideZoneRatio);

    const resolvedMove = resolveDrop(state, dragId, overId, mode);
    if (!resolvedMove) {
      setPreview({
        overId,
        mode,
        isValid: false,
        reason: 'Unable to resolve drop target',
      });
      return;
    }

    const validation = validateMove({
      state,
      dragId,
      overId,
      targetParentId: resolvedMove.targetParentId,
      mode,
    });

    setPreview({
      overId,
      mode,
      isValid: validation.valid,
      reason: validation.reason,
    });
  }

  function onDragEnd(event: DragEndEvent): void {
    const dragId = activeDragId;
    const eventOverId = toRowId(event.over?.id);

    if (dragId && eventOverId && preview.mode && preview.isValid) {
      onMove(dragId, eventOverId, preview.mode);
    }

    setActiveDragId(null);
    setPreview(initialPreview);
  }

  function onDragCancel(): void {
    setActiveDragId(null);
    setPreview(initialPreview);
  }

  return {
    sensors,
    activeDragId,
    activeRow,
    preview,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
  };
}
