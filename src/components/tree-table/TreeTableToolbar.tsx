import type { DropHintMode } from '../../features/tree-table/hooks/useTreeTable';

interface TreeTableToolbarProps {
  virtualizationEnabled: boolean;
  onToggleVirtualization: () => void;
  dropHintMode: DropHintMode;
  onCycleDropHintMode: () => void;
  overlayOpacity: number;
  onOverlayOpacityChange: (value: number) => void;
  autoExpandDropParent: boolean;
  onToggleAutoExpandDropParent: () => void;
  onReset: () => void;
  feedbackMessage: string | null;
}

export function TreeTableToolbar({
  virtualizationEnabled,
  onToggleVirtualization,
  dropHintMode,
  onCycleDropHintMode,
  overlayOpacity,
  onOverlayOpacityChange,
  autoExpandDropParent,
  onToggleAutoExpandDropParent,
  onReset,
  feedbackMessage,
}: TreeTableToolbarProps) {
  const dropHintModeLabel =
    dropHintMode === 'off'
      ? 'Colored Boxes'
      : dropHintMode === 'labels'
        ? 'Labels'
        : dropHintMode === 'minimal'
          ? 'Colored Rows'
          : 'Grayed Rows';

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white/90 px-3 py-3 backdrop-blur-sm">
      <button
        type="button"
        onClick={onToggleVirtualization}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Virtualization: {virtualizationEnabled ? 'On' : 'Off'}
      </button>

      <button
        type="button"
        onClick={onCycleDropHintMode}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Drop hints: {dropHintModeLabel}
      </button>

      <button
        type="button"
        onClick={onToggleAutoExpandDropParent}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Auto-expand parent: {autoExpandDropParent ? 'On' : 'Off'}
      </button>

      <label className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700">
        Overlay opacity
        <input
          type="range"
          min={0.2}
          max={1}
          step={0.05}
          value={overlayOpacity}
          onChange={(event) => onOverlayOpacityChange(Number(event.target.value))}
          className="w-28 accent-slate-700"
        />
        <span className="w-8 text-right text-xs tabular-nums">{Math.round(overlayOpacity * 100)}%</span>
      </label>

      <button
        type="button"
        onClick={onReset}
        className="rounded-md border border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
      >
        Reset demo data
      </button>

      <div className="ml-auto text-sm text-slate-600">{feedbackMessage ?? 'Ready'}</div>
    </div>
  );
}
