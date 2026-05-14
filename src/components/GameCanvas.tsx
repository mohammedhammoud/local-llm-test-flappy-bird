import { useRef, useLayoutEffect } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';
import { draw } from '../game/renderer';
import type { InternalState } from '../game/engine';

interface Props {
  stateRef: React.RefObject<InternalState>;
  dtRef: React.RefObject<number>;
}

export function GameCanvas({ stateRef, dtRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const state = stateRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    draw(ctx, state.bird, state.pipes, state.score, dtRef.current, state.phase === 'playing');
  });

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        borderRadius: 8,
      }}
    />
  );
}
