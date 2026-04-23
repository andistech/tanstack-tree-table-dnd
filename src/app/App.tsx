import { TreeTableDemo } from '../components/tree-table/TreeTableDemo';

export default function App() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1360px] px-4 py-8 md:px-6 lg:px-8">
      <header className="mb-6 rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <p className="mb-2 inline-flex rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
          React 19 + TanStack + dnd-kit
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Tree Table Component Demo
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
          Demo and reference implementation for a reusable tree table. Drag rows to reorder or reparent,
          inspect drop hint modes, and validate constraints in real time.
        </p>
      </header>

      <TreeTableDemo />
    </main>
  );
}
