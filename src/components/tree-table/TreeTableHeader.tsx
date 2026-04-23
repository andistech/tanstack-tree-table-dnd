import { flexRender, type HeaderGroup } from '@tanstack/react-table';

import type { TreeTableColumnMeta } from './api-types';
import { cn } from '../../lib/cn';
import type { VisibleRow } from '../../features/tree-table/model/types';

interface TreeTableHeaderProps {
  headerGroups: HeaderGroup<VisibleRow>[];
}

export function TreeTableHeader({ headerGroups }: TreeTableHeaderProps) {
  return (
    <thead className="sticky top-0 z-20 bg-slate-900 text-slate-100">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const meta = header.column.columnDef.meta as TreeTableColumnMeta | undefined;

            return (
              <th
                key={header.id}
                className={cn(
                  'border-b border-slate-800 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide',
                  meta?.headerClassName,
                )}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}
