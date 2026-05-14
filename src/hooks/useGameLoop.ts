import { useEffect } from 'react';

/** requestAnimationFrame loop with delta-time in ms. */
export function useGameLoop(
  onTick: (dt: number) => void,
  running: boolean,
  frameRef: React.MutableRefObject<number | null>,
) {
  useEffect(() => {
    if (!running) return;

    let last = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(now - last, 32);
      last = now;
      onTick(dt);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [running, onTick, frameRef]);
}
