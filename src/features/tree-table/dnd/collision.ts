import { DROP_INSIDE_ZONE_RATIO } from '../../../components/tree-table/constants';
import type { DropMode } from '../model/types';

interface RectLike {
  top: number;
  height: number;
}

export function resolveDropModeFromRects(
  activeRect: RectLike | null,
  overRect: RectLike | null,
): DropMode {
  if (!activeRect || !overRect) {
    return 'inside';
  }

  const pointerY = activeRect.top + activeRect.height / 2;
  const topThreshold = overRect.top + overRect.height * ((1 - DROP_INSIDE_ZONE_RATIO) / 2);
  const bottomThreshold = overRect.top + overRect.height * (1 - (1 - DROP_INSIDE_ZONE_RATIO) / 2);

  if (pointerY < topThreshold) {
    return 'before';
  }

  if (pointerY > bottomThreshold) {
    return 'after';
  }

  return 'inside';
}
