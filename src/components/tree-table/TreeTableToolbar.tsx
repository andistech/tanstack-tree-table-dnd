interface TreeTableToolbarProps {
  virtualizationEnabled: boolean;
  onToggleVirtualization: () => void;
  showDropZones: boolean;
  onToggleDropZones: () => void;
  onReset: () => void;
  feedbackMessage: string | null;
}

export function TreeTableToolbar({
  virtualizationEnabled,
  onToggleVirtualization,
  showDropZones,
  onToggleDropZones,
  onReset,
  feedbackMessage,
}: TreeTableToolbarProps) {
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
        onClick={onToggleDropZones}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Drop zones: {showDropZones ? 'On' : 'Off'}
      </button>

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
