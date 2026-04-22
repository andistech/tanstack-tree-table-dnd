import {
  closestCenter,
  pointerWithin,
  type CollisionDetection,
} from '@dnd-kit/core';

import {
  DROP_AFTER_ZONE_START,
  DROP_BEFORE_ZONE_END,
} from '../../../components/tree-table/constants';
import type { DropMode } from '../model/types';

interface RectLike {
  top: number;
  height: number;
}

export const treeTableCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);

  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  // Fallback keeps keyboard drag behavior stable.
  return closestCenter(args);
};

export function resolveDropModeFromPosition(overRect: RectLike | null, pointerY: number | null): DropMode {
  if (!overRect || pointerY === null) {
    return 'inside';
  }

  const relativeY = (pointerY - overRect.top) / overRect.height;

  if (relativeY < DROP_BEFORE_ZONE_END) {
    return 'before';
  }

  if (relativeY >= DROP_AFTER_ZONE_START) {
    return 'after';
  }

  return 'inside';
}
