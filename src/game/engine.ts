import type { Bird, Pipe, GamePhase } from '../types';
import {
  GRAVITY,
  JUMP_VELOCITY,
  BIRD_X,
  BIRD_SIZE,
  PIPE_WIDTH,
  PIPE_GAP,
  PIPE_SPEED,
  PIPE_SPAWN_INTERVAL,
  GROUND_HEIGHT,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from '../constants';

// ── helpers ─────────────────────────────────────────────────

function createBird(): Bird {
  return {
    x: BIRD_X,
    y: CANVAS_HEIGHT / 2 - 40,
    velocity: 0,
    rotation: 0,
  };
}

function randomGapY(): number {
  const minTop = GROUND_HEIGHT + PIPE_GAP / 2 + 30;
  const maxBottom = CANVAS_HEIGHT - GROUND_HEIGHT - PIPE_GAP / 2 - 30;
  return Math.random() * (maxBottom - minTop) + minTop;
}

function hitBounds(bird: Bird): boolean {
  const top = bird.y - BIRD_SIZE / 2;
  const bottom = bird.y + BIRD_SIZE / 2;
  return bottom >= CANVAS_HEIGHT - GROUND_HEIGHT || top <= 0;
}

function hitPipe(bird: Bird, pipes: Pipe[]): boolean {
  const left = bird.x - BIRD_SIZE / 2;
  const right = bird.x + BIRD_SIZE / 2;
  const top = bird.y - BIRD_SIZE / 2;
  const bottom = bird.y + BIRD_SIZE / 2;

  return pipes.some((p) => {
    if (right > p.x && left < p.x + PIPE_WIDTH) {
      const gapTop = p.gapY - PIPE_GAP / 2;
      const gapBottom = p.gapY + PIPE_GAP / 2;
      return top < gapTop || bottom > gapBottom;
    }
    return false;
  });
}

function loadBest(): number {
  try {
    const v = localStorage.getItem('flappy-best');
    return v !== null ? parseInt(v, 10) : 0;
  } catch {
    return 0;
  }
}

function saveBest(n: number): void {
  try {
    localStorage.setItem('flappy-best', String(n));
  } catch {
    // noop
  }
}

// ── public API ──────────────────────────────────────────────

export interface InternalState {
  bird: Bird;
  pipes: (Pipe & { scored?: boolean })[];
  score: number;
  bestScore: number;
  phase: GamePhase;
  _lastSpawnAcc: number;
}

export function createInitial(): InternalState {
  return {
    phase: 'idle',
    bird: createBird(),
    pipes: [],
    score: 0,
    bestScore: loadBest(),
    _lastSpawnAcc: 0,
  };
}

/** Start or restart the game. */
export function start(state: InternalState): void {
  state.phase = 'playing';
  state.bird = createBird();
  state.pipes = [];
  state.score = 0;
  state._lastSpawnAcc = 0;
}

/** Jump. */
export function jump(state: InternalState): void {
  if (state.phase === 'playing') {
    state.bird.velocity = JUMP_VELOCITY;
  }
}

/** One tick (ms delta). Returns true if bird survived. */
export function tick(state: InternalState, dt: number): boolean {
  const bird = state.bird;
  const scale = dt / 16.667;

  // Bird physics
  bird.velocity += GRAVITY * scale;
  bird.y += bird.velocity * scale;

  // Rotation follows velocity
  bird.rotation = Math.min(Math.max(bird.velocity * 4, -25), 90);

  // Move pipes
  for (const p of state.pipes) {
    p.x -= PIPE_SPEED * scale;
  }

  // Spawn pipes
  state._lastSpawnAcc += dt;
  if (state._lastSpawnAcc >= PIPE_SPAWN_INTERVAL) {
    state._lastSpawnAcc = 0;
    state.pipes.push({ x: CANVAS_WIDTH + 10, gapY: randomGapY(), scored: false });
  }

  // Score
  for (const p of state.pipes) {
    if (!p.scored && p.x + PIPE_WIDTH < bird.x) {
      p.scored = true;
      state.score += 1;
    }
  }

  // Prune
  state.pipes = state.pipes.filter((p) => p.x + PIPE_WIDTH > -10);

  // Collision
  if (hitPipe(bird, state.pipes) || hitBounds(bird)) {
    state.phase = 'gameOver';
    if (state.score > state.bestScore) {
      saveBest(state.score);
      state.bestScore = state.score;
    }
    return false;
  }

  return true;
}
