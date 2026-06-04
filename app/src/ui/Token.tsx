import type { CSSProperties, ReactNode } from 'react';

type Variant = 'default' | 'accent' | 'cool' | 'mute' | 'ghost';

type Props = {
  children: ReactNode;
  variant?: Variant;
  style?: CSSProperties;
  title?: string;
};

const variants: Record<Variant, CSSProperties> = {
  default: {
    background: 'var(--bg-elev)',
    color: 'var(--ink)',
    border: '1px solid var(--line)',
  },
  accent: {
    background: 'var(--accent-soft)',
    color: 'var(--accent)',
    border: '1px solid var(--accent-line)',
  },
  cool: {
    background: 'rgba(123, 214, 195, 0.15)',
    color: 'var(--cool)',
    border: '1px solid rgba(123, 214, 195, 0.4)',
  },
  mute: {
    background: 'transparent',
    color: 'var(--ink-soft)',
    border: '1px dashed var(--line)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--ink-mute)',
    border: '1px dashed var(--line-soft)',
  },
};

export function Token({ children, variant = 'default', style, title }: Props) {
  return (
    <span
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 6,
        fontFamily: 'var(--mono)',
        fontSize: 13,
        lineHeight: 1.2,
        whiteSpace: 'pre',
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
