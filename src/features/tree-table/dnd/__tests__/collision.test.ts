import { describe, expect, it } from 'vitest';

import { resolveDropModeFromPosition } from '../collision';

describe('resolveDropModeFromPosition', () => {
  const rowRect = { top: 100, height: 100 };

  it('maps top 35% to before', () => {
    expect(resolveDropModeFromPosition(rowRect, 100)).toBe('before');
    expect(resolveDropModeFromPosition(rowRect, 134.9)).toBe('before');
  });

  it('maps 35%-70% to inside', () => {
    expect(resolveDropModeFromPosition(rowRect, 135)).toBe('inside');
    expect(resolveDropModeFromPosition(rowRect, 150)).toBe('inside');
    expect(resolveDropModeFromPosition(rowRect, 169.9)).toBe('inside');
  });

  it('maps bottom 30% to after', () => {
    expect(resolveDropModeFromPosition(rowRect, 170)).toBe('after');
    expect(resolveDropModeFromPosition(rowRect, 199.9)).toBe('after');
  });
});
