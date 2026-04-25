import type { ReactNode } from 'react';

interface DragOverlayCell {
  id: string;
  content: ReactNode;
  width: number;
  className: string;
}

interface TreeTableDragOverlayProps {
  cells: DragOverlayCell[];
  overlayOpacity: number;
}

export function TreeTableDragOverlay({ cells, overlayOpacity }: TreeTableDragOverlayProps) {
  if (cells.length === 0) {
    return null;
  }

  return (
    <div
      className="overflow-hidden rounded-md border border-slate-300 bg-white text-sm shadow-xl"
      style={{ opacity: overlayOpacity }}
    >
      <table className="w-full table-fixed">
        <colgroup>
          {cells.map((cell) => (
            <col key={cell.id} style={{ width: `${Math.max(120, cell.width)}px` }} />
          ))}
        </colgroup>
        <tbody>
          <tr className="border-b border-slate-200">
            {cells.map((cell) => (
              <td key={cell.id} className={cell.className}>
                {cell.content}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
