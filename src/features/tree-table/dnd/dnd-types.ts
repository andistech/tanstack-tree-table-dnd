import type { DropMode, RowId } from '../model/types';

export interface ActiveDragState {
  dragId: RowId;
}

export interface DndPreviewState {
  overId: RowId | null;
  mode: DropMode | null;
  isValid: boolean;
  reason?: string;
}
