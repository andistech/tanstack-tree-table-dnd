import { flexRender, type HeaderGroup } from '@tanstack/react-table';

import type { TreeTableColumnMeta } from './api-types';
import { cn } from '../../lib/cn';
import type { VisibleRow } from '../../features/tree-table/model/types';

interface TreeTableHeaderProps {
  headerGroups: HeaderGroup<VisibleRow>[];
}

export function TreeTableHeader({ headerGroups }: TreeTableHeaderProps) {
  return (
    <thead className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur supports-[backdrop-filter]:bg-slate-50/80 [&_tr]:border-b">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            const meta = header.column.columnDef.meta as TreeTableColumnMeta | undefined;

            return (
              <th
                key={header.id}
                className={cn(
                  'h-10 px-4 text-left align-middle text-xs font-medium tracking-wide text-slate-600',
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
