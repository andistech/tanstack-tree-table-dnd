import { getSiblingIds } from './tree-selectors';
import { resolveDrop } from './resolve-drop';
import { validateMove } from './validation';
import type { MoveNodeInput, MoveNodeResult, RowId, TreeState } from './types';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function withoutId(ids: RowId[], id: RowId): RowId[] {
  return ids.filter((candidate) => candidate !== id);
}

function insertAt(ids: RowId[], index: number, id: RowId): RowId[] {
  return [...ids.slice(0, index), id, ...ids.slice(index)];
}

function withSiblings(state: TreeState, parentId: RowId | null, siblingIds: RowId[]): TreeState {
  if (parentId === null) {
    return {
      ...state,
      rootIds: siblingIds,
    };
  }

  return {
    ...state,
    nodesById: {
      ...state.nodesById,
      [parentId]: {
        ...state.nodesById[parentId],
        childIds: siblingIds,
      },
    },
  };
}

export function moveNode({ state, dragId, overId, mode }: MoveNodeInput): MoveNodeResult {
  const dragNode = state.nodesById[dragId];
  if (!dragNode) {
    return {
      nextState: state,
      changed: false,
      reason: 'Dragged row does not exist',
    };
  }

  const resolvedMove = resolveDrop(state, dragId, overId, mode);
  if (!resolvedMove) {
    return {
      nextState: state,
      changed: false,
      reason: 'Unable to resolve move target',
    };
  }

  const validation = validateMove({
    state,
    dragId,
    overId,
    targetParentId: resolvedMove.targetParentId,
    mode,
  });

  if (!validation.valid) {
    return {
      nextState: state,
      changed: false,
      reason: validation.reason,
      resolvedMove,
    };
  }

  const sourceParentId = dragNode.parentId;
  const sourceSiblings = getSiblingIds(state, sourceParentId);
  const sourceIndex = sourceSiblings.indexOf(dragId);

  if (sourceIndex < 0) {
    return {
      nextState: state,
      changed: false,
      reason: 'Dragged row index not found in source siblings',
      resolvedMove,
    };
  }

  const destinationParentId = resolvedMove.targetParentId;

  if (sourceParentId === destinationParentId) {
    const siblingsWithoutDrag = withoutId(sourceSiblings, dragId);
    let insertIndex = resolvedMove.targetIndex;

    if (resolvedMove.targetIndex > sourceIndex) {
      insertIndex -= 1;
    }
    insertIndex = clamp(insertIndex, 0, siblingsWithoutDrag.length);

    if (insertIndex === sourceIndex) {
      return {
        nextState: state,
        changed: false,
        reason: 'Move would not change sibling order',
        resolvedMove: {
          ...resolvedMove,
          targetIndex: insertIndex,
        },
      };
    }

    const destinationSiblings = insertAt(siblingsWithoutDrag, insertIndex, dragId);

    const nextState = withSiblings(state, sourceParentId, destinationSiblings);

    return {
      nextState,
      changed: true,
      resolvedMove: {
        ...resolvedMove,
        targetIndex: insertIndex,
      },
    };
  }

  const sourceWithoutDrag = withoutId(sourceSiblings, dragId);
  const destinationSiblings = getSiblingIds(state, destinationParentId);
  const insertIndex = clamp(resolvedMove.targetIndex, 0, destinationSiblings.length);
  const destinationWithDrag = insertAt(destinationSiblings, insertIndex, dragId);

  let nextState = withSiblings(state, sourceParentId, sourceWithoutDrag);
  nextState = withSiblings(nextState, destinationParentId, destinationWithDrag);

  nextState = {
    ...nextState,
    nodesById: {
      ...nextState.nodesById,
      [dragId]: {
        ...nextState.nodesById[dragId],
        parentId: destinationParentId,
      },
    },
  };

  return {
    nextState,
    changed: true,
    resolvedMove: {
      ...resolvedMove,
      targetIndex: insertIndex,
    },
  };
}
