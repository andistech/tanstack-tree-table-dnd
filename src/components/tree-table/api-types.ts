import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import type { ColumnDef } from '@tanstack/react-table';
import type { ReactNode } from 'react';

import type { VisibleRow } from '../../features/tree-table/model/types';

export interface TreeTableColumnMeta {
  headerClassName?: string;
  cellClassName?: string;
}

export type TreeTableColumnDef = ColumnDef<VisibleRow, unknown>;

export interface TreeTableDragHandleBindings {
  attributes: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
  setActivatorNodeRef: (element: HTMLElement | null) => void;
}

export interface TreeTableCellRenderContext {
  row: VisibleRow;
  onToggleExpand: (id: string) => void;
  handle: TreeTableDragHandleBindings;
}

export interface TreeTableOverlayRenderContext {
  row: VisibleRow;
  overlayOpacity: number;
}

export type TreeTableCellRenderer = (context: TreeTableCellRenderContext) => ReactNode;
export type TreeTableOverlayRenderer = (context: TreeTableOverlayRenderContext) => ReactNode;
