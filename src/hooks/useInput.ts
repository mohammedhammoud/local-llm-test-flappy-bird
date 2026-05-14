import { useEffect, useRef } from 'react';

interface Options {
  onPrimaryAction: () => void;
  onRestart: () => void;
}

export function useInput({ onPrimaryAction, onRestart }: Options) {
  const onPrimaryActionRef = useRef(onPrimaryAction);
  const onRestartRef = useRef(onRestart);
  onPrimaryActionRef.current = onPrimaryAction;
  onRestartRef.current = onRestart;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        onPrimaryActionRef.current();
      }
      if (e.code === 'KeyR' || e.key === 'r') {
        onRestartRef.current();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target;
      if (target instanceof HTMLElement && target.closest('button')) return;
      onPrimaryActionRef.current();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);
}
