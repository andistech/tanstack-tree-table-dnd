import { useMemo, useState } from 'react';

import { createDemoTreeState } from '../demo/demo-data';
import { moveNode } from '../model/move-node';
import { toggleExpanded } from '../model/tree-state';
import type { DropMode, MoveNodeResult, TreeState } from '../model/types';
import { useVisibleRows } from './useVisibleRows';

export function useTreeTable(initialState?: TreeState) {
  const seeded = useMemo(() => initialState ?? createDemoTreeState(), [initialState]);

  const [state, setState] = useState<TreeState>(seeded);
  const [lastMove, setLastMove] = useState<MoveNodeResult | null>(null);
  const [virtualizationEnabled, setVirtualizationEnabled] = useState(false);
  const [showDropLabels, setShowDropLabels] = useState(true);

  const visibleRows = useVisibleRows(state);

  const feedbackMessage = useMemo(() => {
    if (!lastMove) {
      return null;
    }

    if (!lastMove.changed) {
      return lastMove.reason ?? 'Move rejected';
    }

    if (!lastMove.resolvedMove) {
      return 'Move applied';
    }

    return `Moved to ${lastMove.resolvedMove.mode} (${lastMove.resolvedMove.targetIndex})`;
  }, [lastMove]);

  function onToggleExpand(id: string): void {
    setState((previous) => toggleExpanded(previous, id));
  }

  function onMove(dragId: string, overId: string | null, mode: DropMode): MoveNodeResult {
    let resultSnapshot: MoveNodeResult = {
      nextState: state,
      changed: false,
      reason: 'Move was not executed',
    };

    setState((previous) => {
      const result = moveNode({
        state: previous,
        dragId,
        overId,
        mode,
      });

      resultSnapshot = result;
      setLastMove(result);

      return result.nextState;
    });

    return resultSnapshot;
  }

  function onReset(): void {
    const next = createDemoTreeState();
    setState(next);
    setLastMove(null);
  }

  return {
    state,
    visibleRows,
    lastMove,
    feedbackMessage,
    virtualizationEnabled,
    showDropLabels,
    setVirtualizationEnabled,
    setShowDropLabels,
    onToggleExpand,
    onMove,
    onReset,
  };
}
