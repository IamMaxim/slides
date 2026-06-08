import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  size?: 'lg' | 'md' | 'sm';
  align?: 'left' | 'center';
};

export function SlideTitle({ children, size = 'lg', align = 'left' }: Props) {
  return (
    <h1 className="slide-title" data-size={size} data-align={align}>
      {children}
    </h1>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function BodyText({ children, size = 'md' }: { children: ReactNode; size?: 'md' | 'lg' | 'sm' }) {
  return (
    <p className="body-text" data-size={size}>
      {children}
    </p>
  );
}
