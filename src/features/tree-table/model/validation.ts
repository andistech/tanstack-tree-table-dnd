import { canNodeHaveChildren, getNodeOrNull } from './tree-selectors';
import type { DropMode, RowId, TreeState } from './types';

export function isDescendant(
  state: TreeState,
  ancestorId: RowId,
  possibleDescendantId: RowId,
): boolean {
  const ancestor = state.nodesById[ancestorId];
  if (!ancestor) {
    return false;
  }

  const queue = [...ancestor.childIds];

  while (queue.length > 0) {
    const candidateId = queue.shift();
    if (!candidateId) {
      continue;
    }

    if (candidateId === possibleDescendantId) {
      return true;
    }

    const candidateNode = state.nodesById[candidateId];
    if (candidateNode) {
      queue.push(...candidateNode.childIds);
    }
  }

  return false;
}

export interface ValidateMoveArgs {
  state: TreeState;
  dragId: RowId;
  overId: RowId | null;
  targetParentId: RowId | null;
  mode: DropMode;
}

export function validateMove(args: ValidateMoveArgs): { valid: boolean; reason?: string } {
  const { state, dragId, overId, targetParentId, mode } = args;

  const dragNode = getNodeOrNull(state, dragId);
  if (!dragNode) {
    return { valid: false, reason: 'Dragged row does not exist' };
  }

  if (dragNode.data.isDisabled) {
    return { valid: false, reason: 'Dragged row is disabled' };
  }

  if (overId && overId === dragId) {
    return { valid: false, reason: 'Cannot drop onto itself' };
  }

  const overNode = getNodeOrNull(state, overId);
  if (overNode?.data.isDisabled) {
    return { valid: false, reason: 'Target row is disabled' };
  }

  if (mode === 'inside') {
    if (!overNode) {
      return { valid: false, reason: 'Missing inside target row' };
    }

    if (overId === dragNode.parentId) {
      return { valid: false, reason: 'This row is already the current parent' };
    }

    if (!canNodeHaveChildren(overNode)) {
      return { valid: false, reason: 'Target row cannot accept children' };
    }
  }

  if (targetParentId === dragId) {
    return { valid: false, reason: 'A row cannot be parent of itself' };
  }

  if (targetParentId) {
    const parentNode = getNodeOrNull(state, targetParentId);

    if (!parentNode) {
      return { valid: false, reason: 'Target parent does not exist' };
    }

    if (parentNode.data.isDisabled) {
      return { valid: false, reason: 'Target parent is disabled' };
    }

    if (!canNodeHaveChildren(parentNode)) {
      return { valid: false, reason: 'Target parent cannot accept children' };
    }

    if (isDescendant(state, dragId, targetParentId)) {
      return { valid: false, reason: 'Cannot move a row into its own descendant' };
    }
  }

  return { valid: true };
}
