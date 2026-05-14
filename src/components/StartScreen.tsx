import React from 'react';

interface Props {
  onStart: () => void;
}

export function StartScreen({ onStart }: Props) {
  return (
    <div style={styles.overlay}>
      <div style={styles.inner}>
        <h1 style={styles.title}>Flappy Bird</h1>
        <p style={styles.subtitle}>Press Space or tap to start</p>
        <div style={styles.birdAnim}>
          <span style={styles.bird}>🐦</span>
        </div>
        <button style={styles.btn} onClick={onStart}>
          Start Game
        </button>
        <p style={styles.hint}>Press <kbd style={styles.kbd}>Space</kbd> / <kbd style={styles.kbd}>R</kbd> or tap</p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.45)',
    borderRadius: 8,
    backdropFilter: 'blur(4px)',
    zIndex: 10,
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '32px 40px',
    background: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    color: '#333',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    margin: 0,
  },
  birdAnim: {
    fontSize: 48,
    animation: 'float 1.2s ease-in-out infinite',
  },
  bird: {},
  btn: {
    marginTop: 8,
    padding: '10px 32px',
    fontSize: 16,
    fontWeight: 700,
    color: '#fff',
    background: 'linear-gradient(135deg, #74bf64, #558040)',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.20)',
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  kbd: {
    display: 'inline-block',
    padding: '2px 6px',
    fontSize: 11,
    background: '#eee',
    borderRadius: 4,
    border: '1px solid #ccc',
    fontFamily: 'monospace',
  },
};
