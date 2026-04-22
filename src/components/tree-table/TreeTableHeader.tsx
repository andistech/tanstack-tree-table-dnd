import { flexRender, type HeaderGroup } from '@tanstack/react-table';

import type { VisibleRow } from '../../features/tree-table/model/types';

interface TreeTableHeaderProps {
  headerGroups: HeaderGroup<VisibleRow>[];
}

export function TreeTableHeader({ headerGroups }: TreeTableHeaderProps) {
  return (
    <thead className="sticky top-0 z-20 bg-slate-900 text-slate-100">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className="border-b border-slate-800 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide"
            >
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
}
