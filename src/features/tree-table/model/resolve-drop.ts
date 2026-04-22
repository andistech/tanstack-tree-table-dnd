import { getIndexWithinParent } from './tree-selectors';
import type { DropMode, ResolvedMove, RowId, TreeState } from './types';

export function resolveDrop(
  state: TreeState,
  dragId: RowId,
  overId: RowId | null,
  mode: DropMode,
): ResolvedMove | null {
  if (!state.nodesById[dragId]) {
    return null;
  }

  if (!overId) {
    return {
      dragId,
      targetParentId: null,
      targetIndex: state.rootIds.length,
      mode,
    };
  }

  const overNode = state.nodesById[overId];
  if (!overNode) {
    return null;
  }

  if (mode === 'inside') {
    return {
      dragId,
      targetParentId: overId,
      targetIndex: overNode.childIds.length,
      mode,
    };
  }

  const targetParentId = overNode.parentId;
  const overIndex = getIndexWithinParent(state, overId);

  if (overIndex < 0) {
    return null;
  }

  return {
    dragId,
    targetParentId,
    targetIndex: mode === 'before' ? overIndex : overIndex + 1,
    mode,
  };
}
