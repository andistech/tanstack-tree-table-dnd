import type { MoveNodeResult, TreeState } from '../../features/tree-table/model/types';

interface TreeTableDebugPanelProps {
  state: TreeState;
  lastMove: MoveNodeResult | null;
}

export function TreeTableDebugPanel({ state, lastMove }: TreeTableDebugPanelProps) {
  return (
    <aside className="min-h-[220px] rounded-lg border border-slate-200 bg-slate-950 p-3 text-xs text-slate-200">
      <div className="mb-2 font-semibold text-amber-300">Debug inspector</div>
      <div className="mb-2 text-slate-400">Canonical TreeState + last move result</div>
      <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded border border-slate-800 bg-slate-900 p-3 leading-5">
        {JSON.stringify({ lastMove, state }, null, 2)}
      </pre>
    </aside>
  );
}
