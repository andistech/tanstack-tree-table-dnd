import type { MoveNodeResult, TreeState } from '../../features/tree-table/model/types';

interface TreeTableDebugPanelProps {
  state: TreeState;
  lastMove: MoveNodeResult | null;
}

export function TreeTableDebugPanel({ state, lastMove }: TreeTableDebugPanelProps) {
  return (
    <aside className="rounded-md border border-slate-200 bg-white">
      <details className="group">
        <summary className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 marker:hidden">
          <span>Debug inspector</span>
          <span className="text-xs font-normal text-slate-500 group-open:hidden">Expand</span>
          <span className="hidden text-xs font-normal text-slate-500 group-open:inline">Collapse</span>
        </summary>

        <div className="border-t border-slate-200 p-3">
          <div className="mb-2 text-xs text-slate-500">Canonical TreeState + last move result</div>
          <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-700">
            {JSON.stringify({ lastMove, state }, null, 2)}
          </pre>
        </div>
      </details>
    </aside>
  );
}
