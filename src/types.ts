export type Bird = {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
};

export type Pipe = {
  x: number;
  gapY: number;
};

export type GamePhase = 'idle' | 'playing' | 'gameOver';
