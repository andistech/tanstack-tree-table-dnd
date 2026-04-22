import type { TreeNode, TreeRowData, TreeState } from '../model/types';

interface SeedNode {
  id: string;
  label: string;
  kind: TreeRowData['kind'];
  amount?: number;
  owner?: string;
  updatedAt?: string;
  canHaveChildren?: boolean;
  isDisabled?: boolean;
  children?: SeedNode[];
}

function toTreeNode(seed: SeedNode, parentId: string | null, childIds: string[]): TreeNode {
  return {
    id: seed.id,
    parentId,
    childIds,
    data: {
      id: seed.id,
      label: seed.label,
      kind: seed.kind,
      amount: seed.amount,
      owner: seed.owner,
      updatedAt: seed.updatedAt,
      canHaveChildren: seed.canHaveChildren,
      isDisabled: seed.isDisabled,
    },
  };
}

function buildTreeState(seedRoots: SeedNode[]): TreeState {
  const nodesById: Record<string, TreeNode> = {};

  const visit = (seed: SeedNode, parentId: string | null): string => {
    const childIds = (seed.children ?? []).map((child) => child.id);

    nodesById[seed.id] = toTreeNode(seed, parentId, childIds);

    (seed.children ?? []).forEach((child) => {
      visit(child, seed.id);
    });

    return seed.id;
  };

  const rootIds = seedRoots.map((seed) => visit(seed, null));

  return {
    nodesById,
    rootIds,
    expandedIds: {
      accounts: true,
      projects: true,
      operations: true,
      assets: true,
      liabilities: true,
      revenue: true,
      expenses: true,
      'epic-core': true,
      'ops-support': true,
    },
  };
}

function buildProjectEpics(): SeedNode[] {
  const epicDefs = [
    { id: 'core', label: 'Core Platform', owner: 'Mina' },
    { id: 'growth', label: 'Growth Engine', owner: 'Ibrahim' },
    { id: 'mobile', label: 'Mobile App', owner: 'Elena' },
    { id: 'ai', label: 'AI Assistant', owner: 'Noah' },
    { id: 'security', label: 'Security Controls', owner: 'Priya' },
    { id: 'billing', label: 'Billing Rewrite', owner: 'Carla' },
  ];

  return epicDefs.map((epic, epicIndex) => ({
    id: `epic-${epic.id}`,
    label: epic.label,
    kind: 'group',
    owner: epic.owner,
    amount: 35000 + epicIndex * 4500,
    canHaveChildren: true,
    children: Array.from({ length: 4 }, (_, taskIndex) => {
      const number = taskIndex + 1;
      return {
        id: `task-${epic.id}-${number}`,
        label: `${epic.label} Task ${number}`,
        kind: 'item',
        owner: ['Leah', 'Dario', 'Asha', 'Tom'][taskIndex],
        amount: 2400 + taskIndex * 450,
        updatedAt: `2026-03-${String(11 + epicIndex + taskIndex).padStart(2, '0')}`,
        canHaveChildren: false,
      };
    }),
  }));
}

const seedRoots: SeedNode[] = [
  {
    id: 'accounts',
    label: 'Accounts',
    kind: 'group',
    owner: 'Finance Team',
    canHaveChildren: true,
    children: [
      {
        id: 'assets',
        label: 'Assets',
        kind: 'group',
        owner: 'Erin',
        amount: 180000,
        canHaveChildren: true,
        children: [
          {
            id: 'cash',
            label: 'Cash',
            kind: 'item',
            amount: 69000,
            owner: 'Erin',
            updatedAt: '2026-04-10',
          },
          {
            id: 'receivables',
            label: 'Receivables',
            kind: 'item',
            amount: 51000,
            owner: 'Maks',
            updatedAt: '2026-04-06',
          },
          {
            id: 'inventory',
            label: 'Inventory',
            kind: 'item',
            amount: 60000,
            owner: 'Lina',
            updatedAt: '2026-04-08',
          },
        ],
      },
      {
        id: 'liabilities',
        label: 'Liabilities',
        kind: 'group',
        owner: 'Erin',
        amount: 121000,
        canHaveChildren: true,
        children: [
          {
            id: 'payables',
            label: 'Accounts Payable',
            kind: 'item',
            amount: 33000,
            owner: 'Maks',
            updatedAt: '2026-04-01',
          },
          {
            id: 'taxes',
            label: 'Tax Liabilities',
            kind: 'item',
            amount: 19000,
            owner: 'Mina',
            updatedAt: '2026-03-30',
          },
          {
            id: 'loans',
            label: 'Long-term Loans',
            kind: 'item',
            amount: 69000,
            owner: 'Nora',
            updatedAt: '2026-03-25',
          },
        ],
      },
      {
        id: 'revenue',
        label: 'Revenue',
        kind: 'group',
        owner: 'Jonas',
        amount: 380000,
        canHaveChildren: true,
        children: [
          {
            id: 'product-sales',
            label: 'Product Sales',
            kind: 'item',
            amount: 220000,
            owner: 'Jo',
            updatedAt: '2026-04-12',
          },
          {
            id: 'services',
            label: 'Professional Services',
            kind: 'item',
            amount: 160000,
            owner: 'Bea',
            updatedAt: '2026-04-11',
          },
        ],
      },
      {
        id: 'expenses',
        label: 'Expenses',
        kind: 'group',
        owner: 'Jonas',
        amount: 255000,
        canHaveChildren: true,
        children: [
          {
            id: 'payroll',
            label: 'Payroll',
            kind: 'item',
            amount: 140000,
            owner: 'People Ops',
            updatedAt: '2026-04-15',
          },
          {
            id: 'marketing',
            label: 'Marketing Spend',
            kind: 'item',
            amount: 50000,
            owner: 'Growth Team',
            updatedAt: '2026-04-14',
          },
          {
            id: 'facilities',
            label: 'Facilities',
            kind: 'item',
            amount: 65000,
            owner: 'Ops Team',
            updatedAt: '2026-04-13',
          },
        ],
      },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    kind: 'group',
    owner: 'PMO',
    canHaveChildren: true,
    children: buildProjectEpics(),
  },
  {
    id: 'operations',
    label: 'Operations',
    kind: 'group',
    owner: 'Nina',
    canHaveChildren: true,
    children: [
      {
        id: 'ops-support',
        label: 'Support',
        kind: 'group',
        owner: 'Iris',
        canHaveChildren: true,
        children: [
          {
            id: 'support-inbox',
            label: 'Inbox Triage',
            kind: 'item',
            owner: 'Sam',
            amount: 12000,
            updatedAt: '2026-04-17',
          },
          {
            id: 'support-escalations',
            label: 'Escalations',
            kind: 'item',
            owner: 'Kai',
            amount: 22000,
            updatedAt: '2026-04-17',
          },
          {
            id: 'support-qa',
            label: 'Support QA',
            kind: 'item',
            owner: 'Moe',
            amount: 18000,
            updatedAt: '2026-04-16',
          },
        ],
      },
      {
        id: 'ops-infra',
        label: 'Infra',
        kind: 'group',
        owner: 'Omar',
        canHaveChildren: true,
        children: [
          {
            id: 'infra-monitoring',
            label: 'Monitoring Upgrade',
            kind: 'item',
            owner: 'Tess',
            amount: 42000,
            updatedAt: '2026-04-12',
          },
          {
            id: 'infra-cost',
            label: 'Cost Controls',
            kind: 'item',
            owner: 'Mia',
            amount: 26000,
            updatedAt: '2026-04-10',
          },
          {
            id: 'infra-patching',
            label: 'Patching Sprint',
            kind: 'item',
            owner: 'Ari',
            amount: 15000,
            updatedAt: '2026-04-09',
          },
        ],
      },
      {
        id: 'ops-enable',
        label: 'Enablement',
        kind: 'group',
        owner: 'Lars',
        canHaveChildren: true,
        children: [
          {
            id: 'enable-runbooks',
            label: 'Runbook Cleanup',
            kind: 'item',
            owner: 'Vic',
            amount: 11000,
            updatedAt: '2026-04-04',
          },
          {
            id: 'enable-training',
            label: 'Team Training',
            kind: 'item',
            owner: 'Rae',
            amount: 13000,
            updatedAt: '2026-04-05',
          },
          {
            id: 'enable-audit',
            label: 'Quarterly Audit Prep',
            kind: 'item',
            owner: 'Nils',
            amount: 9000,
            updatedAt: '2026-04-03',
          },
        ],
      },
    ],
  },
];

export function createDemoTreeState(): TreeState {
  return buildTreeState(seedRoots);
}
