import type { RowId, TreeNode, TreeState, VisibleRow } from './types';

export function getNodeOrNull(state: TreeState, id: RowId | null): TreeNode | null {
  if (!id) {
    return null;
  }

  return state.nodesById[id] ?? null;
}

export function canNodeHaveChildren(node: TreeNode): boolean {
  if (typeof node.data.canHaveChildren === 'boolean') {
    return node.data.canHaveChildren;
  }

  return node.data.kind === 'group';
}

export function isExpanded(state: TreeState, id: RowId): boolean {
  return Boolean(state.expandedIds[id]);
}

export function getSiblingIds(state: TreeState, parentId: RowId | null): RowId[] {
  if (parentId === null) {
    return state.rootIds;
  }

  return state.nodesById[parentId]?.childIds ?? [];
}

export function getIndexWithinParent(state: TreeState, id: RowId): number {
  const node = state.nodesById[id];
  if (!node) {
    return -1;
  }

  return getSiblingIds(state, node.parentId).indexOf(id);
}

export function getVisibleRows(state: TreeState): VisibleRow[] {
  const rows: VisibleRow[] = [];

  const appendChildren = (parentId: RowId | null, depth: number): void => {
    const siblingIds = getSiblingIds(state, parentId);

    siblingIds.forEach((id, indexWithinParent) => {
      const node = state.nodesById[id];
      if (!node) {
        return;
      }

      const hasChildren = node.childIds.length > 0;
      const expanded = hasChildren && isExpanded(state, id);

      rows.push({
        id,
        parentId: node.parentId,
        depth,
        indexWithinParent,
        isExpanded: expanded,
        hasChildren,
        canHaveChildren: canNodeHaveChildren(node),
        data: node.data,
      });

      if (hasChildren && expanded) {
        appendChildren(id, depth + 1);
      }
    });
  };

  appendChildren(null, 0);
  return rows;
}

export function getDescendantIds(state: TreeState, ancestorId: RowId): RowId[] {
  const ancestor = state.nodesById[ancestorId];
  if (!ancestor) {
    return [];
  }

  const descendants: RowId[] = [];

  const visit = (id: RowId): void => {
    const node = state.nodesById[id];
    if (!node) {
      return;
    }

    node.childIds.forEach((childId) => {
      descendants.push(childId);
      visit(childId);
    });
  };

  visit(ancestorId);

  return descendants;
}
