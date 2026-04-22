import { describe, expect, it } from 'vitest';

import { getVisibleRows } from '../tree-selectors';
import { toggleExpanded } from '../tree-state';
import { createFixtureState } from './fixtures';

describe('getVisibleRows', () => {
  it('projects visible rows using expansion state', () => {
    const state = createFixtureState();

    const rows = getVisibleRows(state);
    expect(rows.map((row) => row.id)).toEqual([
      'root-a',
      'a-1',
      'a-2',
      'a-2-1',
      'a-3',
      'root-b',
      'b-1',
      'root-c',
    ]);

    const nested = rows.find((row) => row.id === 'a-2-1');
    expect(nested?.depth).toBe(2);
  });
});

describe('toggleExpanded', () => {
  it('collapses and expands child rows predictably', () => {
    const state = createFixtureState();

    const collapsedState = toggleExpanded(state, 'a-2');
    expect(getVisibleRows(collapsedState).map((row) => row.id)).toEqual([
      'root-a',
      'a-1',
      'a-2',
      'a-3',
      'root-b',
      'b-1',
      'root-c',
    ]);

    const reexpandedState = toggleExpanded(collapsedState, 'a-2');
    expect(getVisibleRows(reexpandedState).map((row) => row.id)).toEqual([
      'root-a',
      'a-1',
      'a-2',
      'a-2-1',
      'a-3',
      'root-b',
      'b-1',
      'root-c',
    ]);
  });
});
