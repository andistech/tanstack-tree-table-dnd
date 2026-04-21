export type RowId = string;

export type TreeRowKind = 'group' | 'item';

export interface TreeRowData {
  id: RowId;
  label: string;
  kind: TreeRowKind;
  amount?: number;
  owner?: string;
  updatedAt?: string;
  canHaveChildren?: boolean;
  isDisabled?: boolean;
}

export interface TreeNode {
  id: RowId;
  parentId: RowId | null;
  childIds: RowId[];
  data: TreeRowData;
}

export interface TreeState {
  nodesById: Record<RowId, TreeNode>;
  rootIds: RowId[];
  expandedIds: Record<RowId, boolean>;
}

export interface VisibleRow {
  id: RowId;
  parentId: RowId | null;
  depth: number;
  indexWithinParent: number;
  isExpanded: boolean;
  hasChildren: boolean;
  canHaveChildren: boolean;
  data: TreeRowData;
}

export type DropMode = 'before' | 'after' | 'inside';

export interface ResolvedMove {
  dragId: RowId;
  targetParentId: RowId | null;
  targetIndex: number;
  mode: DropMode;
}

export interface MoveNodeInput {
  state: TreeState;
  dragId: RowId;
  overId: RowId | null;
  mode: DropMode;
}

export interface MoveNodeResult {
  nextState: TreeState;
  changed: boolean;
  reason?: string;
  resolvedMove?: ResolvedMove;
}

export interface DropPreview {
  dragId: RowId | null;
  overId: RowId | null;
  mode: DropMode | null;
  isValid: boolean;
  reason?: string;
}
