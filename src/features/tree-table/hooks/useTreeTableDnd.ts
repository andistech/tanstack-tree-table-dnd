import { useMemo, useRef, useState } from 'react';
import type { DragEndEvent, DragMoveEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';

import { resolveDropModeFromPosition } from '../dnd/collision';
import { useTreeTableSensors } from '../dnd/sensors';
import { resolveDrop } from '../model/resolve-drop';
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
const DEBUG_DND = import.meta.env.DEV;

function toRowId(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function getEventClientY(activatorEvent: Event): number | null {
  if (activatorEvent instanceof PointerEvent || activatorEvent instanceof MouseEvent) {
    return activatorEvent.clientY;
  }

  if (activatorEvent instanceof TouchEvent && activatorEvent.touches.length > 0) {
    return activatorEvent.touches[0]?.clientY ?? null;
  }

  if (activatorEvent instanceof TouchEvent && activatorEvent.changedTouches.length > 0) {
    return activatorEvent.changedTouches[0]?.clientY ?? null;
  }

  return null;
}

export function useTreeTableDnd({ state, visibleRows, onMove }: UseTreeTableDndArgs) {
  const sensors = useTreeTableSensors();
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [dragStartClientY, setDragStartClientY] = useState<number | null>(null);
  const [preview, setPreview] = useState<DndPreviewState>(initialPreview);
  const lastTraceSignatureRef = useRef<string | null>(null);

  const activeRow = useMemo(
    () => visibleRows.find((row) => row.id === activeDragId) ?? null,
    [activeDragId, visibleRows],
  );

  function trace(label: string, payload: Record<string, unknown>): void {
    if (!DEBUG_DND) {
      return;
    }

    const signature = JSON.stringify({ label, ...payload });
    if (lastTraceSignatureRef.current === signature) {
      return;
    }

    lastTraceSignatureRef.current = signature;
    console.debug('[TreeTable DnD]', label, payload);
  }

  function onDragStart(event: DragStartEvent): void {
    const dragId = toRowId(event.active.id);
    setActiveDragId(dragId);
    setDragStartClientY(getEventClientY(event.activatorEvent));
    trace('drag-start', {
      dragId,
      startClientY: getEventClientY(event.activatorEvent),
    });
  }

  function updatePreviewFromEvent(event: DragOverEvent | DragMoveEvent, source: 'move' | 'over'): void {
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

    const overRect = event.over?.rect ?? null;
    const translatedRect = event.active.rect.current.translated ?? null;
    const initialRect = event.active.rect.current.initial ?? null;
    const fallbackRect = translatedRect ?? initialRect;
    const pointerYFromRect = translatedRect ? translatedRect.top + translatedRect.height / 2 : null;
    const pointerYFromDelta = dragStartClientY !== null ? dragStartClientY + event.delta.y : null;
    const pointerY =
      pointerYFromRect ??
      pointerYFromDelta ??
      getEventClientY(event.activatorEvent) ??
      (fallbackRect ? fallbackRect.top + fallbackRect.height / 2 : null);
    const mode = resolveDropModeFromPosition(overRect, pointerY);
    const relativeY = overRect && pointerY !== null ? (pointerY - overRect.top) / overRect.height : null;

    const resolvedMove = resolveDrop(state, dragId, overId, mode);
    if (!resolvedMove) {
      trace('preview-unresolved', {
        source,
        dragId,
        overId,
        pointerY,
        relativeY,
        mode,
      });
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

    trace('preview-update', {
      source,
      dragId,
      overId,
      mode,
      pointerY,
      pointerYFromRect,
      pointerYFromDelta,
      relativeY,
      targetParentId: resolvedMove.targetParentId,
      targetIndex: resolvedMove.targetIndex,
      isValid: validation.valid,
      reason: validation.reason ?? null,
    });

    setPreview({
      overId,
      mode,
      isValid: validation.valid,
      reason: validation.reason,
    });
  }

  function onDragMove(event: DragMoveEvent): void {
    updatePreviewFromEvent(event, 'move');
  }

  function onDragOver(event: DragOverEvent): void {
    updatePreviewFromEvent(event, 'over');
  }

  function onDragEnd(event: DragEndEvent): void {
    const dragId = activeDragId;
    const eventOverId = toRowId(event.over?.id);

    if (dragId && eventOverId && preview.mode && preview.isValid) {
      trace('drag-end-apply', {
        dragId,
        overId: eventOverId,
        mode: preview.mode,
      });
      onMove(dragId, eventOverId, preview.mode);
    } else {
      trace('drag-end-skip', {
        dragId,
        overId: eventOverId,
        mode: preview.mode,
        isValid: preview.isValid,
      });
    }

    setActiveDragId(null);
    setDragStartClientY(null);
    setPreview(initialPreview);
    lastTraceSignatureRef.current = null;
  }

  function onDragCancel(): void {
    trace('drag-cancel', {
      dragId: activeDragId,
    });
    setActiveDragId(null);
    setDragStartClientY(null);
    setPreview(initialPreview);
    lastTraceSignatureRef.current = null;
  }

  return {
    sensors,
    activeDragId,
    activeRow,
    preview,
    onDragStart,
    onDragMove,
    onDragOver,
    onDragEnd,
    onDragCancel,
  };
}
