import React, { useEffect, useRef } from "react";
import "./MathBackground.css";

const EQUATIONS = [
  "iℏ ∂/∂t Ψ = ĤΨ",
  "δ(x) = lim ε→0 (ε/(π(x²+ε²)))",
  "Δx · Δp ≥ ℏ/2",
  "R_μν − ½Rg_μν = 8πG/c⁴ T_μν",
  "e^(iπ) + 1 = 0",
  "S = k_B ln Ω",
  "∫ δ(x)f(x)dx = f(0)",
  "⟨δ|ψ⟩ = ψ(0)",
  "∮ B · dA = 0",
  "∇ × E = −∂B/∂t",
  "Hψ = Eψ",
  "∂_μ F^μν = μ₀ J^ν",
  "ds² = −(1−2M/r)dt² + …",
  "Σ_{n=1}^∞ 1/n² = π²/6",
  "γ^μ ∂_μ ψ − mψ = 0",
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

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

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

    class Star {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.size = Math.random() * 2.2 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.vx = 0;
        this.vy = 0;
        this.opacity = Math.random() * 0.8 + 0.25;
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.04 + 0.02;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.twinkle += this.twinkleSpeed;

        const mouse = mouseRef.current;
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const limit = 180;

          if (dist < limit) {
            const force = (limit - dist) / limit;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * 0.5;
            this.vy += Math.sin(angle) * force * 0.5;
          }
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.92;
        this.vy *= 0.92;

        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
        }
      }

      draw() {
        const twinkleAlpha = this.opacity * (0.8 + 0.2 * Math.sin(this.twinkle));
        ctx.fillStyle = `rgba(255, 215, 0, ${twinkleAlpha})`;
        ctx.shadowColor = "rgba(255, 200, 50, 0.6)";
        ctx.shadowBlur = this.size * 2.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        if (this.size > 1.5 && Math.random() > 0.97) {
          ctx.strokeStyle = `rgba(255, 240, 150, ${twinkleAlpha * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(this.x - this.size * 2, this.y);
          ctx.lineTo(this.x + this.size * 2, this.y);
          ctx.moveTo(this.x, this.y - this.size * 2);
          ctx.lineTo(this.x, this.y + this.size * 2);
          ctx.stroke();
        }

        ctx.shadowBlur = 0;
      }
    }

    class EquationText {
      constructor(index) {
        this.text = EQUATIONS[index % EQUATIONS.length];
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * (width - 200) + 80;
        this.y = height + 30;
        this.speedY = Math.random() * 0.35 + 0.15;
        this.fontSize = Math.floor(Math.random() * 7 + 12);
        this.vx = 0;
        this.vy = 0;
        this.opacity = Math.random() * 0.18 + 0.06;
      }

      update() {
        this.y -= this.speedY;

        const mouse = mouseRef.current;
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const limit = 240;

          if (dist < limit) {
            const force = (limit - dist) / limit;
            const angle = Math.atan2(dy, dx);
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
        ctx.fillStyle = `rgba(255, 179, 71, ${this.opacity})`;
        ctx.shadowColor = "rgba(255, 179, 71, 0.5)";
        ctx.shadowBlur = 6;
        ctx.fillText(this.text, this.x, this.y);
        ctx.shadowBlur = 0;
      }
    }

    class DiracPulse {
      constructor() {
        this.reset(true);
        this.life = Math.random() * 2;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = 0;
        this.maxRadius = Math.random() * 70 + 25;
        this.opacity = 0.7;
        this.life = 0;
        this.maxLife = Math.random() * 1.8 + 1;
        this.active = true;
      }

      update(dt) {
        if (!this.active) return;
        this.life += dt;
        const progress = this.life / this.maxLife;
        this.radius = this.maxRadius * progress;
        this.opacity = 0.7 * (1 - progress);

        if (progress >= 1) {
          this.reset();
        }
      }

      draw() {
        if (!this.active) return;
        ctx.strokeStyle = `rgba(255, 179, 71, ${this.opacity})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = `rgba(255, 179, 71, ${this.opacity})`;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = `rgba(255, 200, 100, ${this.opacity * 0.2})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class TempleSpark {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = width / 2 + (Math.random() - 0.5) * 400;
        this.y = height - Math.random() * 180;
        this.size = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = -(Math.random() * 1.2 + 0.4);
        this.life = 0;
        this.maxLife = Math.random() * 2 + 1.5;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.alive = true;
      }

      update(dt) {
        this.life += dt;
        const progress = this.life / this.maxLife;
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.99;
        this.vy *= 0.99;
        this.opacity = (1 - progress) * 0.6;

        if (progress >= 1 || this.y < 0) {
          this.reset();
        }
      }

      draw() {
        ctx.fillStyle = `rgba(255, 220, 80, ${this.opacity})`;
        ctx.shadowColor = `rgba(255, 180, 30, ${this.opacity})`;
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const stars = Array.from({ length: 150 }).map(() => new Star());
    const equations = Array.from({ length: 22 }).map((_, i) => new EquationText(i));
    const diracPulses = Array.from({ length: 10 }).map(() => new DiracPulse());
    const templeSparks = Array.from({ length: 40 }).map(() => new TempleSpark());

    let lastTime = 0;

    const animate = (time) => {
      const dt = lastTime ? (time - lastTime) / 1000 : 0.016;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.update();
        star.draw();
      });

      equations.forEach((eq) => {
        eq.update();
        eq.draw();
      });

      diracPulses.forEach((pulse) => {
        pulse.update(dt);
        pulse.draw();
      });

      templeSparks.forEach((spark) => {
        spark.update(dt);
        spark.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="math-background">
      <div className="nebula nebula-cosmos-gold"></div>
      <div className="nebula nebula-amber"></div>
      <div className="nebula nebula-shaka"></div>

      <div className="cosmos-glow"></div>

      <div className="zodiac-constellations"></div>

      <div className="mandala-overlay">
        <div className="mandala-ring"></div>
        <div className="mandala-ring"></div>
        <div className="mandala-ring"></div>
        <div className="mandala-ring"></div>
        <div className="mandala-ring"></div>
      </div>

      <div className="temple-of-athena">
        <div className="temple-aura"></div>
        <div className="temple-pediment">
          <div className="temple-pediment-inner"></div>
          <div className="temple-pediment-detail"></div>
        </div>
        <div className="temple-columns">
          <div className="temple-column"></div>
          <div className="temple-column"></div>
          <div className="temple-column"></div>
          <div className="temple-column"></div>
          <div className="temple-column"></div>
          <div className="temple-column"></div>
          <div className="temple-column"></div>
          <div className="temple-column"></div>
          <div className="temple-column"></div>
          <div className="temple-column"></div>
          <div className="temple-column"></div>
          <div className="temple-column"></div>
        </div>
        <div className="athena-chamber"></div>
        <div className="temple-rays"></div>
        <div className="temple-flames">
          <div className="flame"></div><div className="flame"></div><div className="flame"></div>
          <div className="flame"></div><div className="flame"></div><div className="flame"></div>
          <div className="flame"></div><div className="flame"></div><div className="flame"></div>
          <div className="flame"></div><div className="flame"></div><div className="flame"></div>
        </div>
        <div className="temple-stairs">
          <div className="temple-step"></div><div className="temple-step"></div>
          <div className="temple-step"></div><div className="temple-step"></div>
          <div className="temple-step"></div><div className="temple-step"></div>
          <div className="temple-step"></div><div className="temple-step"></div>
          <div className="temple-step"></div><div className="temple-step"></div>
        </div>
      </div>

      <div className="mental-grid"></div>

      <canvas ref={canvasRef} className="physics-canvas" />
    </div>
  );
}
