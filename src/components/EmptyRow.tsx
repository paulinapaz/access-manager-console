import type { ReactNode } from 'react';

interface EmptyRowProps {
  colSpan: number;
  title: string;
  description?: ReactNode;
}

export function EmptyRow({ colSpan, title, description }: EmptyRowProps) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="empty">
          <h3>{title}</h3>
          {description ? <div>{description}</div> : null}
        </div>
      </td>
    </tr>
  );
}
