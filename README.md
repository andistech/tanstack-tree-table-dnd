# TanStack Tree Table DnD

[![Demo](https://img.shields.io/badge/demo-live-0ea5e9)](https://andistech.github.io/tanstack-tree-table-dnd/)

A reusable React Tree Table with drag-and-drop reordering and reparenting, built on TanStack Table + dnd-kit.

## Live demo

- https://andistech.github.io/tanstack-tree-table-dnd/

## Features

- Hierarchical rows with expand/collapse
- Drag-and-drop sibling reordering (`before` / `after`)
- Reparenting via drop-inside behavior (`inside`)
- Validation rules (self, descendant, non-droppable targets, current-parent check)
- Multiple drop hint modes:
  - `Colored Boxes`
  - `Labels`
  - `Colored Rows`
  - `Grayed Rows`
- Full-row drag overlay preview (all visible columns)
- Toolbar toggles for:
  - virtualization
  - drop hint mode
  - auto-expand drop parent
  - drag handle tooltips
  - drag overlay opacity
- Optional row virtualization
- TypeScript-first API with render overrides

## Installation

Preferred distribution is via a shadcn registry item.

```bash
bunx shadcn@latest add https://andistech.github.io/tanstack-tree-table-dnd/r/tree-table.json
```

Installed entrypoint:

- `src/components/ui/tree-table.tsx`

The installer also copies required source files (tree model, hooks, DnD logic)
into your project and installs declared dependencies.

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
    dragHandleTooltipsEnabled,
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
      dragHandleTooltipsEnabled={dragHandleTooltipsEnabled}
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
- Toggle built-in drag-handle tooltip visibility with `dragHandleTooltipsEnabled`
- Style per column via TanStack `meta.headerClassName` and `meta.cellClassName`

## Registry URLs

- Index: `https://andistech.github.io/tanstack-tree-table-dnd/r/registry.json`
- Item: `https://andistech.github.io/tanstack-tree-table-dnd/r/tree-table.json`

## Local development

```bash
bun install
bun dev
```

### Quality checks

```bash
bun run lint
bun test
bun run build
```

### Build registry artifacts locally

```bash
bun run registry:build
```

## Included registry files

- `registry.json`
- `registry/tree-table.json`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local development, testing, architecture notes, and release/deployment details.
