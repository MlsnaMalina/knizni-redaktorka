import type { CSSProperties } from 'react';

/** Styl s vlastními proměnnými CSS (--w, --h, ...). */
export type CSSVars = CSSProperties & { [key: `--${string}`]: string | number | undefined };
