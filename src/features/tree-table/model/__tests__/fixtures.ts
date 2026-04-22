import type { TreeState } from '../types';

export function createFixtureState(): TreeState {
  return {
    nodesById: {
      'root-a': {
        id: 'root-a',
        parentId: null,
        childIds: ['a-1', 'a-2', 'a-3'],
        data: {
          id: 'root-a',
          label: 'Root A',
          kind: 'group',
          canHaveChildren: true,
        },
      },
      'root-b': {
        id: 'root-b',
        parentId: null,
        childIds: ['b-1'],
        data: {
          id: 'root-b',
          label: 'Root B',
          kind: 'group',
          canHaveChildren: true,
        },
      },
      'root-c': {
        id: 'root-c',
        parentId: null,
        childIds: [],
        data: {
          id: 'root-c',
          label: 'Root C',
          kind: 'item',
          canHaveChildren: false,
        },
      },
      'a-1': {
        id: 'a-1',
        parentId: 'root-a',
        childIds: [],
        data: {
          id: 'a-1',
          label: 'A-1',
          kind: 'item',
        },
      },
      'a-2': {
        id: 'a-2',
        parentId: 'root-a',
        childIds: ['a-2-1'],
        data: {
          id: 'a-2',
          label: 'A-2',
          kind: 'group',
          canHaveChildren: true,
        },
      },
      'a-2-1': {
        id: 'a-2-1',
        parentId: 'a-2',
        childIds: [],
        data: {
          id: 'a-2-1',
          label: 'A-2-1',
          kind: 'item',
        },
      },
      'a-3': {
        id: 'a-3',
        parentId: 'root-a',
        childIds: [],
        data: {
          id: 'a-3',
          label: 'A-3',
          kind: 'item',
        },
      },
      'b-1': {
        id: 'b-1',
        parentId: 'root-b',
        childIds: [],
        data: {
          id: 'b-1',
          label: 'B-1',
          kind: 'item',
        },
      },
    },
    rootIds: ['root-a', 'root-b', 'root-c'],
    expandedIds: {
      'root-a': true,
      'root-b': true,
      'a-2': true,
    },
  };
}
