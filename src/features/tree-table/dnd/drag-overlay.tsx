import type { VisibleRow } from '../model/types';

interface TreeTableDragOverlayProps {
  row: VisibleRow | null;
}

export function TreeTableDragOverlay({ row }: TreeTableDragOverlayProps) {
  if (!row) {
    return null;
  }

  return (
    <div className="w-[320px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-xl">
      <div className="font-semibold text-slate-900">{row.data.label}</div>
      <div className="text-xs text-slate-500">{row.data.kind.toUpperCase()}</div>
    </div>
  );
}
