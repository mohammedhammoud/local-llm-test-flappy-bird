import { useRef, useCallback, useState } from 'react';
import type { RefObject } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { useGameLoop } from './hooks/useGameLoop';
import { useInput } from './hooks/useInput';
import { createInitial, start, jump, tick } from './game/engine';
import type { InternalState } from './game/engine';

interface OverlayData {
  score: number;
  bestScore: number;
}

export default function App() {
  const stateRef = useRef<InternalState>(createInitial());

  // Mirror overlay-critical state so we don't read refs during render
  const [phase, setPhase] = useState(stateRef.current.phase);
  const [overlayData, setOverlayData] = useState<OverlayData>({
    score: stateRef.current.score,
    bestScore: stateRef.current.bestScore,
  });

  // Keep mirror in sync after mutations
  const poke = useCallback(() => {
    const s = stateRef.current;
    setPhase(s.phase);
    setOverlayData({ score: s.score, bestScore: s.bestScore });
  }, []);

  const dtRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  // ── game tick ────
  const onTick = useCallback(
    (dt: number) => {
      dtRef.current = dt;
      tick(stateRef.current, dt);
      poke();
    },
    [poke],
  );

  useGameLoop(onTick, phase === 'playing', frameRef);

  // ── actions ────
  const handleStart = useCallback(() => {
    start(stateRef.current);
    jump(stateRef.current);
    poke();
  }, [poke]);

  const handlePrimaryAction = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === 'idle') {
      start(s);
      jump(s);
      poke();
      return;
    }
    if (s.phase === 'playing') {
      jump(s);
      return;
    }
    start(s);
    poke();
  }, [poke]);

  const handleRestart = useCallback(() => {
    start(stateRef.current);
    poke();
  }, [poke]);

  // ── input ────
  useInput({ onPrimaryAction: handlePrimaryAction, onRestart: handleRestart });

  // ── render ────
  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <GameCanvas stateRef={stateRef as RefObject<InternalState>} dtRef={dtRef} />
        {phase === 'idle' && <StartScreen onStart={handleStart} />}
        {phase === 'gameOver' && (
          <GameOverScreen
            score={overlayData.score}
            bestScore={overlayData.bestScore}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #2c3e50 0%, #1a1a2e 100%)',
    fontFamily: '"Segoe UI", system-ui, sans-serif',
    overflow: 'hidden',
  },
  container: {
    position: 'relative',
    width: '85vmin',
    maxWidth: 440,
    aspectRatio: '2 / 3',
    maxHeight: '92vh',
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
  },
};
