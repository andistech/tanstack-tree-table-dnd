import { useState } from 'react';

import { TreeTable } from './TreeTable';
import { TreeTableDebugPanel } from './TreeTableDebugPanel';
import { TreeTableToolbar } from './TreeTableToolbar';
import { useTreeTable } from '../../features/tree-table/hooks/useTreeTable';

export function TreeTableDemo() {
  const {
    state,
    visibleRows,
    lastMove,
    feedbackMessage,
    virtualizationEnabled,
    showDropZones,
    setVirtualizationEnabled,
    setShowDropZones,
    onToggleExpand,
    onMove,
    onReset,
  } = useTreeTable();

  const [dragFeedback, setDragFeedback] = useState<string | null>(null);

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-3">
        <TreeTableToolbar
          virtualizationEnabled={virtualizationEnabled}
          onToggleVirtualization={() => setVirtualizationEnabled((previous) => !previous)}
          showDropZones={showDropZones}
          onToggleDropZones={() => setShowDropZones((previous) => !previous)}
          onReset={onReset}
          feedbackMessage={dragFeedback ?? feedbackMessage}
        />

        <TreeTable
          state={state}
          visibleRows={visibleRows}
          virtualizationEnabled={virtualizationEnabled}
          showDropZones={showDropZones}
          onToggleExpand={onToggleExpand}
          onMove={onMove}
          onDragFeedbackChange={setDragFeedback}
        />
      </div>

      <TreeTableDebugPanel state={state} lastMove={lastMove} />
    </section>
  );
}
