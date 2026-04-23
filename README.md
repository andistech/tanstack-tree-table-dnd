# React Tree Table Demo

Production-oriented TreeTable prototype built with:

- Bun
- Vite 6
- TypeScript 5.6
- React 19
- Tailwind CSS 4
- TanStack Table v8
- TanStack Virtual v3
- dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`)

## Run

```bash
bun install
bun dev
```

## Test

```bash
bun test
bun run build
```

## Tree model

Canonical state uses a normalized adjacency structure (`nodesById`, `rootIds`, `expandedIds`).

`VisibleRow[]` is derived from canonical state for rendering/virtualization and is never stored as canonical state.

## Move algorithm

Source: `src/features/tree-table/model/move-node.ts`

1. Resolve the drop into a deterministic target (`targetParentId`, `targetIndex`) with `before` / `after` / `inside`.
2. Validate constraints:
   - no self-drop
   - no dropping into descendants (cycle prevention)
   - target parent supports children
   - disabled rows cannot move/receive drops
3. Remove dragged id from source sibling list.
4. Insert into destination sibling list.
5. Apply same-parent index correction when moving downward.
6. Update `parentId` only when parent changes.
7. Return immutable `nextState` with `changed`/`reason` metadata.

## Demo behaviors

- Expand/collapse groups
- Reorder siblings
- Reparent by dropping `inside` an allowed target
- Invalid drop highlighting and rejection reasons
- Optional row virtualization toggle
- Debug inspector for canonical state and last move

## Shareable distribution (shadcn registry)

This repo includes a custom shadcn registry setup for this component:

- [`registry.json`](registry.json)
- [`registry/tree-table.json`](registry/tree-table.json)

The registry item declares npm dependencies so `shadcn` can install them automatically.

### Install from a hosted registry item

Host this repository (or a static export that includes `registry/`, `registry.json`, and the referenced `src/` files), then run:

```bash
bunx shadcn@latest add https://<your-host>/registry/tree-table.json
```

After install, the entry file is copied to:

- `src/components/ui/tree-table.tsx`
