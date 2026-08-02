import React, { useState, useRef, useEffect } from "react";
import shakaCosmicImg from "../assets/shaka_cosmic.jpg";
import { Sparkles, Ban, CheckCircle, Orbit, Trophy } from "lucide-react";
import "./AstralCard.css";

export default function AstralCard({ judgment }) {
  const { name, status, entropy, divineWill, quantumLevel, voiceQuote } = judgment;
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ rx: 0, ry: 0, px: 50, py: 50 });
  const [digivolving, setDigivolving] = useState(false);

  // Mouse move 3D tilt + Holographic reflections
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    
    // Normalize coordinates for 3D tilt (-15 to 15 deg)
    const rx = -((y - box.height / 2) / (box.height / 2)) * 16;
    const ry = ((x - box.width / 2) / (box.width / 2)) * 16;

    // Normalize percentage coordinates for background-position
    const px = (x / box.width) * 100;
    const py = (y / box.height) * 100;

    setCoords({ rx, ry, px, py });
  };

  const handleMouseLeave = () => {
    setCoords({ rx: 0, ry: 0, px: 50, py: 50 });
  };

  // Trigger digivolution visual effect if status changes
  useEffect(() => {
    setDigivolving(true);
    const timer = setTimeout(() => setDigivolving(false), 1200);
    return () => clearTimeout(timer);
  }, [status]);

  const isProhibited = status === "prohibido";

  return (
    <div className="card-container">
      {/* Digivolution ring overlays */}
      {digivolving && (
        <div className="digivolve-overlay">
          <div className="digi-ring ring-1"></div>
          <div className="digi-ring ring-2"></div>
          <div className="digi-ring ring-3"></div>
          <div className="digi-text">MODULANDO MATERIA Y ESPÍN...</div>
        </div>
      )}

      <div
        ref={cardRef}
        className={`astral-card ${isProhibited ? "prohibited-theme" : "permitted-theme"} ${digivolving ? "digi-glitch" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${coords.rx}deg) rotateY(${coords.ry}deg)`,
        }}
      >
        {/* ✨ Holographic Sheen Layer (Foil overlay) */}
        <div 
          className="card-holo-foil"
          style={{
            backgroundPosition: `${coords.px}% ${coords.py}%`,
            opacity: coords.rx !== 0 ? 0.35 : 0 // fades in on hover
          }}
        />

        {/* Gloss Lens Reflection */}
        <div 
          className="card-shine"
          style={{
            background: `radial-gradient(circle at ${coords.px}% ${coords.py}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%)`
          }}
        />

        {/* Card Border Frame Glow */}
        <div className="card-neon-aura"></div>

        {/* Card Header */}
        <div className="card-header">
          <span className="card-title">
            JUICIO: {name.toUpperCase()}
          </span>
          <span className={`card-attribute ${isProhibited ? "attr-prohibited" : "attr-permitted"}`}>
            {isProhibited ? <Ban size={13} /> : <CheckCircle size={13} />}
            {isProhibited ? "PROHIBIDO" : "PERMITIDO"}
          </span>
        </div>

        {/* Quantum / Virgo Levels */}
        <div className="card-levels">
          {Array.from({ length: Math.min(12, Math.max(1, quantumLevel || 1)) }).map((_, i) => (
            <div key={i} className="level-star">
              <Orbit size={11} className="star-icon" />
            </div>
          ))}
          <span className="level-label">LVL {quantumLevel || 1}</span>
        </div>

        {/* Card Image Container */}
        <div className="card-image-box">
          <img src={shakaCosmicImg} alt="Virgo Shaka" className="card-img" />
          <div className="card-image-lens-flare"></div>
          <div className="card-image-border-glow"></div>
          {/* Authentic Hologram Seal */}
          <div className={`holo-seal ${isProhibited ? "proh" : "perm"}`}>
            <Trophy size={10} />
          </div>
        </div>

        {/* Card Metadata / Effect Text */}
        <div className="card-body">
          <div className="card-type">[ CARTA DE LEY ASTRAL ]</div>
          <p className="card-description">
            {isProhibited ? (
              <>
                <strong>[Decreto]:</strong> Al entrar en contacto con esta sentencia, la entropía molecular del sujeto se eleva a la masa de Planck. Queda cancelada toda digievolución orgánica. 
                Decreto: <em>"{voiceQuote || 'Sucios mortales'}"</em>.
              </>
            ) : (
              <>
                <strong>[Licencia]:</strong> Se concede estabilidad gravitatoria y salvaguarda astral por Virgo Shaka. Autorizado para vagar en materia bariónica. 
                Decreto: <em>"{voiceQuote || 'Lo permito...'}"</em>.
              </>
            )}
          </p>

          {/* Stats Bar */}
          <div className="card-stats">
            <div className="stat-item">
              <span className="stat-lbl">ENT/</span>
              <span className="stat-val">{entropy || (isProhibited ? 9999 : 0)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-lbl">VD/</span>
              <span className="stat-val">{divineWill || (isProhibited ? "0" : "∞")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-lbl">NC/</span>
              <span className="stat-val">{quantumLevel || 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
