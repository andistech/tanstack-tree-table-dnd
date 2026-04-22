import { useMemo } from 'react';

import { getVisibleRows } from '../model/tree-selectors';
import type { TreeState, VisibleRow } from '../model/types';

export function useVisibleRows(state: TreeState): VisibleRow[] {
  return useMemo(() => getVisibleRows(state), [state]);
}
