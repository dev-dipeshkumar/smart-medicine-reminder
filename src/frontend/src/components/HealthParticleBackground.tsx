import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number; // 0..1, higher = closer = larger + more opaque
  vx: number;
  vy: number;
  phase: number; // sine wave offset
  speed: number;
  size: number;
  type: "cross" | "circle" | "ring" | "dot";
  colorIdx: number;
  opacity: number;
}

// OKLCH-derived RGBA for teal / indigo / cyan — baked as RGBA for canvas
const COLORS = [
  // teal (oklch 0.68 0.16 178)
  [0, 210, 200] as [number, number, number],
  // cyan (oklch 0.72 0.18 200)
  [0, 220, 230] as [number, number, number],
  // indigo (oklch 0.60 0.18 260)
  [80, 120, 240] as [number, number, number],
  // soft teal variant
  [30, 195, 185] as [number, number, number],
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function initParticles(count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => {
    const z = Math.random();
    return {
      x: rand(0, w),
      y: rand(0, h),
      z,
      vx: rand(-0.08, 0.08),
      vy: -rand(0.18, 0.55) * (0.3 + z * 0.7), // faster when "closer"
      phase: rand(0, Math.PI * 2),
      speed: rand(0.008, 0.025),
      size: rand(1.2, 3.2) * (0.4 + z * 0.9),
      type: (["cross", "circle", "ring", "dot"] as const)[
        Math.floor(Math.random() * 4)
      ],
      colorIdx: Math.floor(Math.random() * COLORS.length),
      opacity: rand(0.06, 0.22) * (0.3 + z * 0.8),
    };
  });
}

function drawCross(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  const arm = r * 1.6;
  const thick = r * 0.45;
  ctx.beginPath();
  // Horizontal bar
  ctx.rect(x - arm, y - thick, arm * 2, thick * 2);
  // Vertical bar
  ctx.rect(x - thick, y - arm, thick * 2, arm * 2);
  ctx.fill();
}

function drawRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
) {
  ctx.beginPath();
  ctx.arc(x, y, r * 1.8, 0, Math.PI * 2);
  ctx.lineWidth = r * 0.35;
  ctx.stroke();
}

export function HealthParticleBackground({
  className = "",
}: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      // Static gradient only
      const w = canvas.offsetWidth || 800;
      const h = canvas.offsetHeight || 600;
      canvas.width = w;
      canvas.height = h;
      const grad = ctx.createRadialGradient(
        w * 0.3,
        h * 0.3,
        0,
        w * 0.5,
        h * 0.5,
        w * 0.8,
      );
      grad.addColorStop(0, "rgba(0,210,200,0.06)");
      grad.addColorStop(0.5, "rgba(80,120,240,0.04)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      return;
    }

    let W = 0;
    let H = 0;
    let particles: Particle[] = [];
    let rafId = 0;
    let tick = 0;

    const PARTICLE_COUNT = 80;

    function resize() {
      W = canvas!.offsetWidth || window.innerWidth;
      H = canvas!.offsetHeight || window.innerHeight;
      canvas!.width = W;
      canvas!.height = H;
      particles = initParticles(PARTICLE_COUNT, W, H);
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, W, H);
      tick += 1;

      // Subtle radial vignette — adds depth
      const grad = ctx.createRadialGradient(
        W * 0.5,
        H * 0.4,
        0,
        W * 0.5,
        H * 0.5,
        W * 0.75,
      );
      grad.addColorStop(0, "rgba(0,200,195,0.04)");
      grad.addColorStop(0.45, "rgba(60,100,220,0.035)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Very faint grid — clinical / dashboard feel
      const gridSpacing = 64;
      ctx.save();
      ctx.strokeStyle = "rgba(0,200,200,0.025)";
      ctx.lineWidth = 0.5;
      for (let gx = 0; gx < W; gx += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, H);
        ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
        ctx.stroke();
      }
      ctx.restore();

      // Particles
      for (const p of particles) {
        const sineX = Math.sin(p.phase + tick * p.speed) * 22 * (0.4 + p.z);
        const px = p.x + sineX;
        const py = p.y;

        const [r, g, b] = COLORS[p.colorIdx];
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.strokeStyle = `rgb(${r},${g},${b})`;

        if (p.type === "cross") {
          drawCross(ctx, px, py, p.size);
        } else if (p.type === "ring") {
          drawRing(ctx, px, py, p.size);
        } else {
          // circle or dot
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          if (p.type === "circle") {
            ctx.lineWidth = p.size * 0.4;
            ctx.stroke();
          } else {
            ctx.fill();
          }
        }

        ctx.restore();

        // Move upward
        p.y += p.vy;

        // Wrap to bottom
        if (p.y < -20) {
          p.y = H + rand(0, 40);
          p.x = rand(0, W);
        }
        // Drift x gently
        p.x += p.vx;
        if (p.x < -20) p.x = W + 10;
        if (p.x > W + 20) p.x = -10;
      }

      // Expanding pulse rings — ECG / heartbeat feel
      // 3 rings at fixed anchor points, pulsing at offset phases
      const pulseAnchors = [
        { cx: W * 0.15, cy: H * 0.72, phase: 0 },
        { cx: W * 0.85, cy: H * 0.28, phase: 80 },
        { cx: W * 0.5, cy: H * 0.88, phase: 40 },
      ];
      for (const anchor of pulseAnchors) {
        const t = (tick + anchor.phase) % 140;
        const progress = t / 140;
        const radius = progress * 70 + 10;
        const alpha = (1 - progress) * 0.12;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "rgb(0,210,200)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(anchor.cx, anchor.cy, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      rafId = requestAnimationFrame(draw);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      tabIndex={-1}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}
