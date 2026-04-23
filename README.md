# TanStack Tree Table DnD

[![Demo](https://img.shields.io/badge/demo-live-0ea5e9)](https://andistech.github.io/tanstack-tree-table-dnd/)

A reusable React Tree Table with drag-and-drop reordering and reparenting, built on TanStack Table + dnd-kit.

## Live demo

- https://andistech.github.io/tanstack-tree-table-dnd/

## Features

- Hierarchical rows with expand/collapse
- Drag-and-drop sibling reordering
- Reparenting via drop-inside behavior
- Validation rules (self, descendant, non-droppable targets, current-parent check)
- Multiple drop hint modes
- Optional row virtualization
- TypeScript-first API with render overrides

## Installation

Preferred distribution is via a shadcn registry item.

```bash
bunx shadcn@latest add https://<your-host>/registry/tree-table.json
```

Installed entrypoint:

- `src/components/ui/tree-table.tsx`

## Basic usage

```tsx
import {
  TreeTable,
  treeTableColumns,
  useTreeTable,
} from "@/components/ui/tree-table";

export function Example() {
  const {
    state,
    visibleRows,
    virtualizationEnabled,
    dropHintMode,
    overlayOpacity,
    onToggleExpand,
    onMove,
  } = useTreeTable();

  return (
    <TreeTable
      state={state}
      visibleRows={visibleRows}
      columns={treeTableColumns}
      treeColumnId="tree"
      virtualizationEnabled={virtualizationEnabled}
      dropHintMode={dropHintMode}
      overlayOpacity={overlayOpacity}
      onToggleExpand={onToggleExpand}
      onMove={onMove}
    />
  );
}
```

## Customization

`TreeTable` is designed to be user-owned and customizable.

- Pass your own table columns with `columns`
- Use a different tree column with `treeColumnId`
- Customize tree cell UI with `renderTreeCell`
- Customize drag overlay UI with `renderDragOverlay`
- Style per column via TanStack `meta`:
  - `meta.headerClassName`
  - `meta.cellClassName`

## Included registry files

- `registry.json`
- `registry/tree-table.json`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local development, testing, architecture notes, and release/deployment details.
