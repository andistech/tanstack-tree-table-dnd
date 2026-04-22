import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type SensorDescriptor,
  type SensorOptions,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

export function useTreeTableSensors(): SensorDescriptor<SensorOptions>[] {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
}
