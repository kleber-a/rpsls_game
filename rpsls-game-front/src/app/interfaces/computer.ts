export type CardKey = 'rock' | 'paper' | 'scissors' | 'lizard' | 'spock';

export interface Card {
  key: CardKey;
  icon: string;
  name: string;
}

export interface Player {
  name: string;
  score: number;
  selected: boolean;
  choice: CardKey | '';
  winner: boolean;
  socketId?: string;
}

export interface Results {
  player: string | null;
  opponent: string | null;
}
