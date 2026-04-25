import { useState } from 'react';

import { TreeTable } from './TreeTable';
import { TreeTableDebugPanel } from './TreeTableDebugPanel';
import { TreeTableToolbar } from './TreeTableToolbar';
import { useTreeTable, type DropHintMode } from '../../features/tree-table/hooks/useTreeTable';

export function TreeTableDemo() {
  const {
    state,
    visibleRows,
    lastMove,
    feedbackMessage,
    virtualizationEnabled,
    dropHintMode,
    overlayOpacity,
    autoExpandDropParent,
    dragHandleTooltipsEnabled,
    dragHandlesHoverOnly,
    dragHandleAlignment,
    setVirtualizationEnabled,
    setDropHintMode,
    setOverlayOpacity,
    setAutoExpandDropParent,
    setDragHandleTooltipsEnabled,
    setDragHandlesHoverOnly,
    setDragHandleAlignment,
    onToggleExpand,
    onMove,
    onReset,
  } = useTreeTable();

  const [dragFeedback, setDragFeedback] = useState<string | null>(null);

  const dropHintModeCycle: DropHintMode[] = ['off', 'labels', 'minimal', 'gray'];

  function onCycleDropHintMode(): void {
    setDropHintMode((previous) => {
      const currentIndex = dropHintModeCycle.indexOf(previous);
      const nextIndex = (currentIndex + 1) % dropHintModeCycle.length;
      return dropHintModeCycle[nextIndex];
    });
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-3">
        <TreeTableToolbar
          virtualizationEnabled={virtualizationEnabled}
          onToggleVirtualization={() => setVirtualizationEnabled((previous) => !previous)}
          dropHintMode={dropHintMode}
          onCycleDropHintMode={onCycleDropHintMode}
          overlayOpacity={overlayOpacity}
          onOverlayOpacityChange={setOverlayOpacity}
          autoExpandDropParent={autoExpandDropParent}
          onToggleAutoExpandDropParent={() => setAutoExpandDropParent((previous) => !previous)}
          dragHandleTooltipsEnabled={dragHandleTooltipsEnabled}
          onToggleDragHandleTooltips={() => setDragHandleTooltipsEnabled((previous) => !previous)}
          dragHandlesHoverOnly={dragHandlesHoverOnly}
          onToggleDragHandlesHoverOnly={() => setDragHandlesHoverOnly((previous) => !previous)}
          dragHandleAlignment={dragHandleAlignment}
          onToggleDragHandleAlignment={() =>
            setDragHandleAlignment((previous) => (previous === 'indented' ? 'left' : 'indented'))
          }
          onReset={onReset}
          feedbackMessage={dragFeedback ?? feedbackMessage}
        />

        <TreeTable
          state={state}
          visibleRows={visibleRows}
          virtualizationEnabled={virtualizationEnabled}
          dropHintMode={dropHintMode}
          overlayOpacity={overlayOpacity}
          dragHandleTooltipsEnabled={dragHandleTooltipsEnabled}
          dragHandlesHoverOnly={dragHandlesHoverOnly}
          dragHandleAlignment={dragHandleAlignment}
          onToggleExpand={onToggleExpand}
          onMove={onMove}
          onDragFeedbackChange={setDragFeedback}
        />
      </div>

      <TreeTableDebugPanel state={state} lastMove={lastMove} />
    </section>
  );
}
