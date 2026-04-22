import { describe, expect, it } from 'vitest';

import { resolveDropModeFromPosition } from '../collision';

describe('resolveDropModeFromPosition', () => {
  const rowRect = { top: 100, height: 100 };

  it('maps top 20% to before', () => {
    expect(resolveDropModeFromPosition(rowRect, 100)).toBe('before');
    expect(resolveDropModeFromPosition(rowRect, 119.9)).toBe('before');
  });

  it('maps 20%-80% to inside', () => {
    expect(resolveDropModeFromPosition(rowRect, 120)).toBe('inside');
    expect(resolveDropModeFromPosition(rowRect, 150)).toBe('inside');
    expect(resolveDropModeFromPosition(rowRect, 179.9)).toBe('inside');
  });

  it('maps bottom 20% to after', () => {
    expect(resolveDropModeFromPosition(rowRect, 180)).toBe('after');
    expect(resolveDropModeFromPosition(rowRect, 199.9)).toBe('after');
  });
});
