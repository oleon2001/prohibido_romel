import React, { useEffect, useRef } from "react";
import "./MathBackground.css";

const EQUATIONS = [
  "iℏ ∂/∂t Ψ = ĤΨ",
  "R_μν - 1/2 R g_μν = 8πG/c⁴ T_μν",
  "e^(iπ) + 1 = 0",
  "S = k_B ln Ω",
  "Δx · Δp ≥ ℏ/2",
  "∮ B · dA = 0",
  "(iγ^μ ∂_μ - m)ψ = 0",
  "∇ × E = -∂B/∂t",
  "Hψ = Eψ",
  "L = T - V",
  "ds² = -(1 - 2M/r)dt² + (1 - 2M/r)⁻¹dr² + r²dΩ²"
];

export default function MathBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Re-adjust on resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Keep track of cursor coordinates
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Particle Classes
    class Star {
      constructor() {
        this.reset();
        this.y = Math.random() * height; // initial spread
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = Math.random() * 0.4 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.vx = 0;
        this.vy = 0;
        this.opacity = Math.random() * 0.6 + 0.2;
      }

      update() {
        // Base movement
        this.y -= this.speedY;
        this.x += this.speedX;

        // Apply gravitational lens effect from cursor
        const mouse = mouseRef.current;
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const limit = 160;

          if (dist < limit) {
            // Gravitational repulsion (lensing effect)
            const force = (limit - dist) / limit;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * 0.4;
            this.vy += Math.sin(angle) * force * 0.4;
          }
        }

        // Apply velocities and drag
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.92;
        this.vy *= 0.92;

        // Reset if offscreen
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.fillStyle = `rgba(197, 163, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class EquationText {
      constructor(index) {
        this.text = EQUATIONS[index % EQUATIONS.length];
        this.reset();
        this.y = Math.random() * height; // initial spread
      }

      reset() {
        this.x = Math.random() * (width - 150) + 50;
        this.y = height + 30;
        this.speedY = Math.random() * 0.3 + 0.15;
        this.fontSize = Math.floor(Math.random() * 5 + 11);
        this.vx = 0;
        this.vy = 0;
        this.opacity = Math.random() * 0.12 + 0.04;
      }

      update() {
        this.y -= this.speedY;

        // Gravitational lens deflection
        const mouse = mouseRef.current;
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const limit = 220;

          if (dist < limit) {
            const force = (limit - dist) / limit;
            const angle = Math.atan2(dy, dx);
            // Deflect equations away from cursor
            this.vx += Math.cos(angle) * force * 0.8;
            this.vy += Math.sin(angle) * force * 0.8;
          }
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.94;
        this.vy *= 0.94;

        if (this.y < -50 || this.x < -100 || this.x > width + 100) {
          this.reset();
        }
      }

      draw() {
        ctx.font = `300 ${this.fontSize}px 'Courier New', monospace`;
        ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
        ctx.shadowColor = "rgba(212, 175, 55, 0.3)";
        ctx.shadowBlur = 4;
        ctx.fillText(this.text, this.x, this.y);
        ctx.shadowBlur = 0; // reset shadow
      }
    }

    // Initialize pools
    const stars = Array.from({ length: 80 }).map(() => new Star());
    const equations = Array.from({ length: 15 }).map((_, i) => new EquationText(i));

    // Game loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Render stars
      stars.forEach((star) => {
        star.update();
        star.draw();
      });

      // Render equations
      equations.forEach((eq) => {
        eq.update();
        eq.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanups
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="math-background">
      {/* Cosmic background nebulae */}
      <div className="nebula nebula-purple"></div>
      <div className="nebula nebula-gold"></div>
      <div className="nebula nebula-blue"></div>

      {/* Grid line patterns */}
      <div className="astral-grid"></div>

      {/* Real-time HTML5 Canvas particle engine */}
      <canvas ref={canvasRef} className="physics-canvas" />
    </div>
  );
}
