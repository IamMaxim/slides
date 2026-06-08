import type { CSSProperties, ReactNode } from 'react';

export function Split({
  left,
  right,
  ratio = '1fr 1fr',
  gap = 64,
}: {
  left: ReactNode;
  right: ReactNode;
  ratio?: string;
  gap?: number;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: ratio,
        gap,
        width: '100%',
        height: '100%',
        alignItems: 'center',
      }}
    >
      <div style={{ minWidth: 0 }}>{left}</div>
      <div style={{ minWidth: 0 }}>{right}</div>
    </div>
  );
}

export function Stack({
  children,
  gap = 16,
  align = 'start',
  style,
}: {
  children: ReactNode;
  gap?: number;
  align?: CSSProperties['alignItems'];
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap,
        alignItems: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Row({
  children,
  gap = 12,
  align = 'center',
  justify = 'flex-start',
  wrap = false,
  style,
}: {
  children: ReactNode;
  gap?: number;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CenterBox({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}
