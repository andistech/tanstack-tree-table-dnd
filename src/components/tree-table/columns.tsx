import type { ColumnDef } from '@tanstack/react-table';

import { formatCurrency } from '../../lib/format';
import type { VisibleRow } from '../../features/tree-table/model/types';

export const treeTableColumns: ColumnDef<VisibleRow>[] = [
  {
    id: 'tree',
    header: 'Label',
    accessorFn: (row) => row.data.label,
  },
  {
    id: 'owner',
    header: 'Owner',
    accessorFn: (row) => row.data.owner ?? '',
    cell: ({ row }) => row.original.data.owner ?? '—',
  },
  {
    id: 'amount',
    header: 'Amount',
    accessorFn: (row) => row.data.amount ?? 0,
    cell: ({ row }) => formatCurrency(row.original.data.amount),
  },
  {
    id: 'updatedAt',
    header: 'Updated',
    accessorFn: (row) => row.data.updatedAt ?? '',
    cell: ({ row }) => row.original.data.updatedAt ?? '—',
  },
];
