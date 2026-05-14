import React from 'react';

interface Props {
  score: number;
  bestScore: number;
  onRestart: () => void;
}

export function GameOverScreen({ score, bestScore, onRestart }: Props) {
  return (
    <div style={styles.overlay}>
      <div style={styles.inner}>
        <h2 style={styles.title}>Game Over</h2>

        <div style={styles.scoreCard}>
          <div style={styles.scoreRow}>
            <span style={styles.label}>Score</span>
            <span style={styles.value}>{score}</span>
          </div>
          <div style={styles.scoreRow}>
            <span style={styles.label}>Best</span>
            <span style={styles.bestValue}>{bestScore}</span>
          </div>
        </div>

        <button style={styles.btn} onClick={onRestart}>
          Play Again
        </button>
        <p style={styles.hint}>Press <kbd style={styles.kbd}>R</kbd> or tap</p>
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
    background: 'rgba(0,0,0,0.50)',
    borderRadius: 8,
    backdropFilter: 'blur(4px)',
    zIndex: 10,
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
    padding: '28px 36px',
    background: 'rgba(255,255,255,0.94)',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.30)',
  },
  title: {
    fontSize: 28,
    fontWeight: 800,
    color: '#e74c3c',
    margin: 0,
  },
  scoreCard: {
    width: '100%',
    background: '#f4f4f4',
    borderRadius: 10,
    padding: '12px 0',
  },
  scoreRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 20px',
    fontSize: 16,
  },
  label: {
    color: '#555',
    fontWeight: 600,
  },
  value: {
    fontWeight: 800,
    color: '#333',
  },
  bestValue: {
    fontWeight: 800,
    color: '#f39c12',
  },
  btn: {
    marginTop: 6,
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
    marginTop: 2,
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
