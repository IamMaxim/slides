import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  size?: 'lg' | 'md' | 'sm';
  align?: 'left' | 'center';
};

export function SlideTitle({ children, size = 'lg', align = 'left' }: Props) {
  const fontSize =
    size === 'lg'
      ? 'clamp(48px, 5.5vw, 84px)'
      : size === 'sm'
      ? 'clamp(30px, 3.2vw, 44px)'
      : 'clamp(36px, 4vw, 56px)';
  return (
    <h1
      style={{
        fontFamily: 'var(--display)',
        fontSize,
        fontWeight: 300,
        lineHeight: 1.02,
        letterSpacing: '-0.025em',
        fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1",
        textAlign: align,
        maxWidth: '18ch',
      }}
    >
      {children}
    </h1>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--mono)',
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--accent)',
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

export function BodyText({ children, size = 'md' }: { children: ReactNode; size?: 'md' | 'lg' | 'sm' }) {
  const fz = size === 'lg' ? 22 : size === 'sm' ? 14 : 17;
  return (
    <p
      style={{
        color: 'var(--ink-soft)',
        fontSize: fz,
        lineHeight: 1.5,
        maxWidth: '52ch',
      }}
    >
      {children}
    </p>
  );
}
