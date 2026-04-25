import type { DropHintMode } from '../../features/tree-table/hooks/useTreeTable';
import { cn } from '../../lib/cn';

interface TreeTableToolbarProps {
  virtualizationEnabled: boolean;
  onToggleVirtualization: () => void;
  dropHintMode: DropHintMode;
  onCycleDropHintMode: () => void;
  overlayOpacity: number;
  onOverlayOpacityChange: (value: number) => void;
  autoExpandDropParent: boolean;
  onToggleAutoExpandDropParent: () => void;
  dragHandleTooltipsEnabled: boolean;
  onToggleDragHandleTooltips: () => void;
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
  dragHandleTooltipsEnabled,
  onToggleDragHandleTooltips,
  onReset,
  feedbackMessage,
}: TreeTableToolbarProps) {
  const buttonBaseClassName =
    'inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  const outlineButtonClassName = cn(
    buttonBaseClassName,
    'border border-slate-300 bg-white text-slate-700 shadow-xs hover:bg-slate-100',
  );
  const secondaryButtonClassName = cn(
    buttonBaseClassName,
    'bg-slate-100 text-slate-900 shadow-xs hover:bg-slate-200',
  );

  const dropHintModeLabel =
    dropHintMode === 'off'
      ? 'Colored Boxes'
      : dropHintMode === 'labels'
        ? 'Labels'
        : dropHintMode === 'minimal'
          ? 'Colored Rows'
          : 'Grayed Rows';

  return (
    <div className="border-b border-slate-200 bg-white/90 px-3 py-3 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onToggleVirtualization}
          className={outlineButtonClassName}
        >
          Virtualization: {virtualizationEnabled ? 'On' : 'Off'}
        </button>

        <button
          type="button"
          onClick={onCycleDropHintMode}
          className={outlineButtonClassName}
        >
          Drop hints: {dropHintModeLabel}
        </button>

        <button
          type="button"
          onClick={onToggleAutoExpandDropParent}
          className={outlineButtonClassName}
        >
          Auto-expand parent: {autoExpandDropParent ? 'On' : 'Off'}
        </button>

        <button
          type="button"
          onClick={onToggleDragHandleTooltips}
          className={outlineButtonClassName}
        >
          Drag tooltips: {dragHandleTooltipsEnabled ? 'On' : 'Off'}
        </button>

        <label className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-xs">
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
          className={secondaryButtonClassName}
        >
          Reset demo data
        </button>
      </div>

      <div className="mt-3 border-t border-slate-200 pt-2 text-sm">
        <span className="font-semibold text-slate-700">Drag status: </span>
        <span className="text-slate-600">{feedbackMessage ?? 'Ready'}</span>
      </div>
    </div>
  );
}
