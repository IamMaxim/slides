import type { Slide } from '../deck/types';

const placeholder: Slide = {
  id: 'placeholder',
  title: 'от чатбота до тиммейта',
  totalSteps: 1,
  render: () => null,
};
export const slides: Slide[] = [placeholder];
