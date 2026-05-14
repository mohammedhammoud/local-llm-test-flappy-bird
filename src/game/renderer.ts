import type { Bird, Pipe } from '../types';
import {
  BIRD_SIZE,
  PIPE_WIDTH,
  PIPE_GAP,
  GROUND_HEIGHT,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SKY_COLOR,
  GROUND_COLOR,
  GROUND_DARK,
  PIPE_COLOR,
  PIPE_DARK,
  PIPE_BORDER,
  BIRD_COLOR,
  BIRD_DARK,
  BIRD_OUTLINE,
  BIRD_EYE_COLOR,
  BIRD_PUPIL_COLOR,
  BIRD_BEAK_COLOR,
} from '../constants';

// ── background ─────────────────────────────────────

function drawSky(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = SKY_COLOR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawGround(ctx: CanvasRenderingContext2D): void {
  const y = CANVAS_HEIGHT - GROUND_HEIGHT;
  ctx.fillStyle = GROUND_COLOR;
  ctx.fillRect(0, y, CANVAS_WIDTH, GROUND_HEIGHT);

  // Darken ground top edge
  ctx.fillStyle = GROUND_DARK;
  ctx.fillRect(0, y, CANVAS_WIDTH, 4);

  // Ground stripe pattern
  ctx.fillStyle = GROUND_DARK;
  const stripeWidth = 20;
  const stripeSpacing = 38;
  for (let x = -stripeSpacing; x < CANVAS_WIDTH; x += stripeSpacing) {
    ctx.fillRect(x, y + 4, stripeWidth, GROUND_HEIGHT - 4);
  }
}

// ── pipes ─────────────────────────────────────

function drawPipe(ctx: CanvasRenderingContext2D, pipe: Pipe): void {
  const gapTop = pipe.gapY - PIPE_GAP / 2;
  const gapBottom = pipe.gapY + PIPE_GAP / 2;

  // Top pipe body
  ctx.fillStyle = PIPE_COLOR;
  ctx.fillRect(pipe.x, 0, PIPE_WIDTH, gapTop);

  // Top pipe cap
  const capH = 26;
  const capExtra = 4;
  ctx.fillStyle = PIPE_COLOR;
  ctx.fillRect(pipe.x - capExtra, gapTop - capH, PIPE_WIDTH + capExtra * 2, capH);
  ctx.strokeStyle = PIPE_BORDER;
  ctx.lineWidth = 2;
  ctx.strokeRect(pipe.x - capExtra, gapTop - capH, PIPE_WIDTH + capExtra * 2, capH);
  ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, gapTop - capH);

  // Dark highlight on pipe body
  ctx.fillStyle = PIPE_DARK;
  ctx.fillRect(pipe.x + 4, 0, 6, gapTop - capH);

  // Bottom pipe body
  const bottomTop = gapBottom;
  const bottomH = CANVAS_HEIGHT - GROUND_HEIGHT - bottomTop;
  ctx.fillStyle = PIPE_COLOR;
  ctx.fillRect(pipe.x, bottomTop, PIPE_WIDTH, bottomH);

  // Bottom pipe cap
  ctx.fillStyle = PIPE_COLOR;
  ctx.fillRect(pipe.x - capExtra, bottomTop, PIPE_WIDTH + capExtra * 2, capH);
  ctx.strokeStyle = PIPE_BORDER;
  ctx.lineWidth = 2;
  ctx.strokeRect(pipe.x - capExtra, bottomTop, PIPE_WIDTH + capExtra * 2, capH);
  ctx.strokeRect(pipe.x, bottomTop + capH, PIPE_WIDTH, bottomH - capH);

  // Dark highlight
  ctx.fillStyle = PIPE_DARK;
  ctx.fillRect(pipe.x + 4, bottomTop + capH, 6, bottomH - capH);
}

// ── bird ─────────────────────────────────────

function drawBird(ctx: CanvasRenderingContext2D, bird: Bird): void {
  const size = BIRD_SIZE;

  ctx.save();
  ctx.translate(bird.x, bird.y);
  ctx.rotate((bird.rotation * Math.PI) / 180);

  // Body (ellipse)
  ctx.beginPath();
  ctx.ellipse(0, 0, size / 2 + 2, size / 2, 0, 0, Math.PI * 2);
  ctx.fillStyle = BIRD_COLOR;
  ctx.fill();
  ctx.strokeStyle = BIRD_OUTLINE;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Wing
  ctx.beginPath();
  ctx.ellipse(-2, 2, size / 3, size / 5, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = BIRD_DARK;
  ctx.fill();

  // Eye (white background)
  ctx.beginPath();
  ctx.arc(size / 5, -size / 6, size / 4, 0, Math.PI * 2);
  ctx.fillStyle = BIRD_EYE_COLOR;
  ctx.fill();
  ctx.strokeStyle = BIRD_OUTLINE;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Pupil
  ctx.beginPath();
  ctx.arc(size / 5 + 1, -size / 6, size / 8, 0, Math.PI * 2);
  ctx.fillStyle = BIRD_PUPIL_COLOR;
  ctx.fill();

  // Beak
  ctx.beginPath();
  ctx.moveTo(size / 3, -2);
  ctx.lineTo(size / 3 + 8, 2);
  ctx.lineTo(size / 3, 6);
  ctx.closePath();
  ctx.fillStyle = BIRD_BEAK_COLOR;
  ctx.fill();
  ctx.strokeStyle = BIRD_OUTLINE;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();
}

// ── HUD ─────────────────────────────────────

function drawScore(ctx: CanvasRenderingContext2D, score: number): void {
  ctx.save();
  ctx.font = 'bold 42px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#000';
  ctx.strokeText(String(score), CANVAS_WIDTH / 2, 60);
  ctx.fillStyle = '#fff';
  ctx.fillText(String(score), CANVAS_WIDTH / 2, 60);
  ctx.restore();
}

// ── clouds (decoration) ───────────────────────────────

function drawClouds(ctx: CanvasRenderingContext2D, elapsedMs: number): void {
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  const t = elapsedMs * 0.01;

  const clouds = [
    { x: ((t * 8 + 40) % (CANVAS_WIDTH + 100)) - 50, y: 60, scale: 0.8 },
    { x: ((t * 5 + 180) % (CANVAS_WIDTH + 100)) - 50, y: 120, scale: 1 },
    { x: ((t * 6 + 310) % (CANVAS_WIDTH + 100)) - 50, y: 80, scale: 0.6 },
  ];

  for (const c of clouds) {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.scale(c.scale, c.scale);
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.arc(18, -8, 16, 0, Math.PI * 2);
    ctx.arc(35, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ── main draw ─────────────────────────────────────

export function draw(
  ctx: CanvasRenderingContext2D,
  bird: Bird,
  pipes: Pipe[],
  score: number,
  dt: number,
  showScore: boolean,
): void {
  drawSky(ctx);
  drawClouds(ctx, dt);

  for (const p of pipes) {
    drawPipe(ctx, p);
  }

  drawGround(ctx);
  drawBird(ctx, bird);

  if (showScore) {
    drawScore(ctx, score);
  }
}
