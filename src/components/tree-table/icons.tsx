import type { SVGProps } from 'react';

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7 4.5 13 10l-6 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
