import type { VisibleRow } from '../model/types';

interface TreeTableDragOverlayProps {
  row: VisibleRow | null;
  overlayOpacity: number;
}

export function TreeTableDragOverlay({ row, overlayOpacity }: TreeTableDragOverlayProps) {
  if (!row) {
    return null;
  }

  return (
    <div
      className="w-[320px] rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-xl"
      style={{ opacity: overlayOpacity }}
    >
      <div className="font-semibold text-slate-900">{row.data.label}</div>
      <div className="text-xs text-slate-500">{row.data.kind.toUpperCase()}</div>
    </div>
  );
}
