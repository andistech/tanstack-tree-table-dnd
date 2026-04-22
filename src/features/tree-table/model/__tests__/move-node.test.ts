import { describe, expect, it } from 'vitest';

import { moveNode } from '../move-node';
import { createFixtureState } from './fixtures';

describe('moveNode', () => {
  it('moves before within the same parent', () => {
    const state = createFixtureState();

    const result = moveNode({
      state,
      dragId: 'a-3',
      overId: 'a-1',
      mode: 'before',
    });

    expect(result.changed).toBe(true);
    expect(result.nextState.nodesById['root-a'].childIds).toEqual(['a-3', 'a-1', 'a-2']);
  });

  it('moves after within the same parent', () => {
    const state = createFixtureState();

    const result = moveNode({
      state,
      dragId: 'a-1',
      overId: 'a-2',
      mode: 'after',
    });

    expect(result.changed).toBe(true);
    expect(result.nextState.nodesById['root-a'].childIds).toEqual(['a-2', 'a-1', 'a-3']);
  });

  it('moves inside a new parent', () => {
    const state = createFixtureState();

    const result = moveNode({
      state,
      dragId: 'a-1',
      overId: 'root-b',
      mode: 'inside',
    });

    expect(result.changed).toBe(true);
    expect(result.nextState.nodesById['a-1'].parentId).toBe('root-b');
    expect(result.nextState.nodesById['root-b'].childIds).toEqual(['b-1', 'a-1']);
    expect(result.nextState.nodesById['root-a'].childIds).toEqual(['a-2', 'a-3']);
  });

  it('moves from parent A to parent B as sibling before target', () => {
    const state = createFixtureState();

    const result = moveNode({
      state,
      dragId: 'a-2',
      overId: 'b-1',
      mode: 'before',
    });

    expect(result.changed).toBe(true);
    expect(result.nextState.nodesById['a-2'].parentId).toBe('root-b');
    expect(result.nextState.nodesById['root-b'].childIds).toEqual(['a-2', 'b-1']);
    expect(result.nextState.nodesById['root-a'].childIds).toEqual(['a-1', 'a-3']);
  });

  it('rejects dropping into a descendant', () => {
    const state = createFixtureState();

    const result = moveNode({
      state,
      dragId: 'root-a',
      overId: 'a-2',
      mode: 'inside',
    });

    expect(result.changed).toBe(false);
    expect(result.reason).toBe('Cannot move a row into its own descendant');
  });

  it('rejects dropping into itself', () => {
    const state = createFixtureState();

    const result = moveNode({
      state,
      dragId: 'a-1',
      overId: 'a-1',
      mode: 'inside',
    });

    expect(result.changed).toBe(false);
    expect(result.reason).toBe('Cannot drop onto itself');
  });

  it('rejects inside drop to non-droppable target', () => {
    const state = createFixtureState();

    const result = moveNode({
      state,
      dragId: 'a-1',
      overId: 'root-c',
      mode: 'inside',
    });

    expect(result.changed).toBe(false);
    expect(result.reason).toBe('Target row cannot accept children');
  });

  it('adjusts index when moving downward within same parent', () => {
    const state = createFixtureState();

    const result = moveNode({
      state,
      dragId: 'a-1',
      overId: 'a-3',
      mode: 'after',
    });

    expect(result.changed).toBe(true);
    expect(result.nextState.nodesById['root-a'].childIds).toEqual(['a-2', 'a-3', 'a-1']);
    expect(result.resolvedMove?.targetIndex).toBe(2);
  });
});
