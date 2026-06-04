import { Deck } from './deck/Deck';
import { slides } from './slides';

export function App() {
  return <Deck slides={slides} />;
}
