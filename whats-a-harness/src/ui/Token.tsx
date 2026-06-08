import type { CSSProperties, ReactNode } from 'react';

type Variant = 'default' | 'accent' | 'cool' | 'mute' | 'ghost';

type Props = {
  children: ReactNode;
  variant?: Variant;
  style?: CSSProperties;
  title?: string;
};

export function Token({ children, variant = 'default', style, title }: Props) {
  return (
    <span className="token" data-variant={variant} title={title} style={style}>
      {children}
    </span>
  );
}
