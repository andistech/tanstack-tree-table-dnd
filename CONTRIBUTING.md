# Contributing

## Development setup

```bash
bun install
bun dev
```

## Quality checks

```bash
bun run lint
bun test
bun run build
```

## Tech stack

- Bun
- Vite 6
- TypeScript 5.6
- React 19
- Tailwind CSS 4
- TanStack Table v8
- TanStack Virtual v3
- dnd-kit (`@dnd-kit/core`, `@dnd-kit/sortable`)

## Core architecture

Canonical tree state is normalized:

- `nodesById`
- `rootIds`
- `expandedIds`

`VisibleRow[]` is a derived projection for rendering and DnD targeting.

### Source files

- Model: `src/features/tree-table/model/*`
- DnD: `src/features/tree-table/dnd/*`
- Hooks: `src/features/tree-table/hooks/*`
- UI: `src/components/tree-table/*`

## Move algorithm

Source: `src/features/tree-table/model/move-node.ts`

Flow:

1. Resolve drop intent (`before` / `after` / `inside`) and destination.
2. Validate move constraints:
   - no self-drop
   - no drop into descendants
   - target can accept children
   - disabled rows are blocked
   - dropping onto current parent via `inside` is blocked
3. Remove dragged id from source sibling list.
4. Insert into destination sibling list.
5. Correct same-parent downward index shifts.
6. Update `parentId` if parent changed.
7. Return immutable result with `changed` + `reason` metadata.

## Registry distribution

Registry config files:

- `registry.json`
- `registry/tree-table.json`

Build installable shadcn registry artifacts:

```bash
bun run registry:build
```

Generated output:

- `public/r/registry.json`
- `public/r/tree-table.json`

Install URL for consumers:

```bash
bunx shadcn@latest add https://andistech.github.io/tanstack-tree-table-dnd/r/tree-table.json
```

## Demo deployment

GitHub Pages workflow file:

- `.github/workflows/deploy-pages.yml`

It builds via Bun and deploys `dist/` on pushes to `main`.
The workflow also builds the shadcn registry JSON before `vite build`.

## Commit format

Conventional Commits are enforced by hook:

- `type(scope): Subject line`
- Subject in imperative mood, capitalized, no period, max 50 chars
