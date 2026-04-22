import type { RowId, TreeState } from './types';

export function toggleExpanded(state: TreeState, rowId: RowId): TreeState {
  return {
    ...state,
    expandedIds: {
      ...state.expandedIds,
      [rowId]: !state.expandedIds[rowId],
    },
  };
}

export function setExpanded(state: TreeState, rowId: RowId, value: boolean): TreeState {
  if (state.expandedIds[rowId] === value) {
    return state;
  }

  return {
    ...state,
    expandedIds: {
      ...state.expandedIds,
      [rowId]: value,
    },
  };
}

export function resetExpanded(state: TreeState, expandedIds: TreeState['expandedIds']): TreeState {
  return {
    ...state,
    expandedIds: { ...expandedIds },
  };
}
