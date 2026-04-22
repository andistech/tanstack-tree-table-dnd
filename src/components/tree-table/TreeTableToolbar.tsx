interface TreeTableToolbarProps {
  virtualizationEnabled: boolean;
  onToggleVirtualization: () => void;
  showDropLabels: boolean;
  onToggleDropLabels: () => void;
  autoExpandDropParent: boolean;
  onToggleAutoExpandDropParent: () => void;
  onReset: () => void;
  feedbackMessage: string | null;
}

export function TreeTableToolbar({
  virtualizationEnabled,
  onToggleVirtualization,
  showDropLabels,
  onToggleDropLabels,
  autoExpandDropParent,
  onToggleAutoExpandDropParent,
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
        onClick={onToggleDropLabels}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Drop labels: {showDropLabels ? 'On' : 'Off'}
      </button>

      <button
        type="button"
        onClick={onToggleAutoExpandDropParent}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Auto-expand parent: {autoExpandDropParent ? 'On' : 'Off'}
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
