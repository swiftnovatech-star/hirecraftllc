"use client";

import { useId, type SVGProps } from "react";

type DotPatternProps = SVGProps<SVGSVGElement> & {
  spacing?: number;
  radius?: number;
};

export function DotPattern({
  spacing = 22,
  radius = 1,
  className = "",
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg aria-hidden="true" className={`dot-pattern ${className}`} {...props}>
      <defs>
        <pattern
          id={id}
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r={radius} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth="0" fill={`url(#${id})`} />
    </svg>
  );
}
