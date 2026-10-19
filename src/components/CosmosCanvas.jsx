import React, { useEffect, useRef } from "react";

export default function CosmosCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Constellation & Quantum Particle Pool
    const particleCount = Math.min(55, Math.floor(window.innerWidth / 24));
    const palette = [
      "rgba(255, 215, 0, ",
      "rgba(168, 85, 247, ",
      "rgba(0, 245, 212, ",
      "rgba(230, 57, 70, ",
    ];

    const particles = Array.from({ length: particleCount }).map((_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.9 + 0.6,
      color: palette[idx % 7 === 0 ? 2 : idx % 5 === 0 ? 3 : idx % 2 === 0 ? 0 : 1],
      alpha: Math.random() * 0.65 + 0.2,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      pulse: Math.random() * 0.015 + 0.004,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle interactive cursor cosmos aura
      const grad = ctx.createRadialGradient(
        mouseX,
        mouseY,
        20,
        mouseX,
        mouseY,
        Math.min(width, height) * 0.45
      );
      grad.addColorStop(0, "rgba(255, 215, 0, 0.045)");
      grad.addColorStop(0.45, "rgba(168, 85, 247, 0.025)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw faint zodiacal constellation links between close particles
      ctx.lineWidth = 0.55;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          const maxDistSq = 135 * 135;

          if (distSq < maxDistSq) {
            const lineAlpha = (1 - distSq / maxDistSq) * 0.12;
            ctx.strokeStyle = `rgba(218, 165, 32, ${lineAlpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Render particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += p.pulse;
        if (p.alpha > 0.85 || p.alpha < 0.18) p.pulse = -p.pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha.toFixed(2)})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255, 215, 0, 0.45)";
        ctx.fill();
      });

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
