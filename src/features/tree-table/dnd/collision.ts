import { DROP_INSIDE_ZONE_RATIO_DROPPABLE } from '../../../components/tree-table/constants';
import type { DropMode } from '../model/types';

interface RectLike {
  top: number;
  height: number;
}

export function resolveDropModeFromRects(
  activeRect: RectLike | null,
  overRect: RectLike | null,
  insideZoneRatio = DROP_INSIDE_ZONE_RATIO_DROPPABLE,
): DropMode {
  if (!activeRect || !overRect) {
    return 'inside';
  }

  const clampedInsideZoneRatio = Math.min(0.9, Math.max(0.1, insideZoneRatio));
  const pointerY = activeRect.top + activeRect.height / 2;
  const topThreshold = overRect.top + overRect.height * ((1 - clampedInsideZoneRatio) / 2);
  const bottomThreshold = overRect.top + overRect.height * (1 - (1 - clampedInsideZoneRatio) / 2);

  if (pointerY < topThreshold) {
    return 'before';
  }

  if (pointerY > bottomThreshold) {
    return 'after';
  }

  return 'inside';
}
