import type { ReactNode } from 'react';

export type SlideProps = {
  step: number;
};

export type Slide = {
  id: string;
  title: string;
  totalSteps: number;
  render: (props: SlideProps) => ReactNode;
};
