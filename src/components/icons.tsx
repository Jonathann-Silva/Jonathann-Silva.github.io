import * as React from 'react';

export const TorelliAncharLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    {...props}
  >
    <path d="M20 25 L20 75" strokeLinecap="round" />
    <path d="M20 50 L40 50" strokeLinecap="round" />
    <path d="M30 25 L30 75" strokeLinecap="round" />
    
    <path d="M50 75 C 50 25, 80 25, 80 75" strokeLinecap="round" />
    <path d="M65 50 L80 50" strokeLinecap="round" />
  </svg>
);
