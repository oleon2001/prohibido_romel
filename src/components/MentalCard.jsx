import React, { useState, useRef, useEffect, memo } from "react";
import shakaCosmicImg from "../assets/shaka_cosmic.jpg";
import { Ban, CheckCircle, Orbit, Trophy, Download, Sparkles, Image as ImageIcon } from "lucide-react";
import { toPng } from "html-to-image";
import { playCosmicChime } from "../services/audioSynth";
import "./MentalCard.css";

function MentalCard({ judgment }) {
  const { name, status, entropy, divineWill, fCategory, voiceQuote } = judgment;
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const [coords, setCoords] = useState({ rx: 0, ry: 0, px: 50, py: 50 });
  const [digivolving, setDigivolving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current || exporting) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;

    const rx = -((y - box.height / 2) / (box.height / 2)) * 16;
    const ry = ((x - box.width / 2) / (box.width / 2)) * 16;
    const px = (x / box.width) * 100;
    const py = (y / box.height) * 100;

    setCoords({ rx, ry, px, py });
  };

  const handleMouseLeave = () => {
    setCoords({ rx: 0, ry: 0, px: 50, py: 50 });
  };

  useEffect(() => {
    setDigivolving(true);
    const timer = setTimeout(() => setDigivolving(false), 1200);
    return () => clearTimeout(timer);
  }, [status]);

  const handleExportImage = async (format = "square") => {
    if (!cardRef.current) return;
    playCosmicChime();
    setExporting(true);
    setShowExportMenu(false);
    setCoords({ rx: 0, ry: 0, px: 50, py: 50 });

    try {
      await new Promise((r) => setTimeout(r, 100));

      const nodeToCapture = cardRef.current;
      const dataUrl = await toPng(nodeToCapture, {
        cacheBust: true,
        quality: 0.95,
        style: format === "story" ? {
          transform: "none",
          padding: "40px 20px",
          background: "#070714",
          borderRadius: "0px",
        } : {
          transform: "none"
        }
      });

      const link = document.createElement("a");
      link.download = `decreto_${name.toLowerCase().replace(/\s+/g, "_")}_${format}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export image failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const isProhibited = status === "prohibido";
  const stars = Math.min(5, Math.max(1, fCategory || 1));

  return (
    <div className="card-container" ref={containerRef}>
      {digivolving && (
        <div className="digivolve-overlay">
          <div className="digi-ring ring-1"></div>
          <div className="digi-ring ring-2"></div>
          <div className="digi-ring ring-3"></div>
          <div className="digi-data-streams">
            <span className="digi-stream ds1"></span>
            <span className="digi-stream ds2"></span>
            <span className="digi-stream ds3"></span>
          </div>
          <div className="digi-text">MODULANDO MATERIA Y ESPÍN...</div>
        </div>
      )}

      <div
        ref={cardRef}
        className={`mental-card ${isProhibited ? "prohibited-theme" : "permitted-theme"} ${digivolving ? "digi-glitch" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${coords.rx}deg) rotateY(${coords.ry}deg)`,
        }}
      >
        <div
          className="card-holo-foil"
          style={{
            backgroundPosition: `${coords.px}% ${coords.py}%`,
            opacity: coords.rx !== 0 ? 0.35 : 0
          }}
        />

        <div
          className="card-shine"
          style={{
            background: `radial-gradient(circle at ${coords.px}% ${coords.py}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%)`
          }}
        />

        <div className="card-neon-aura"></div>

        <div className="card-header">
          <span className="card-title">
            JUICIO: {name.toUpperCase()}
          </span>
          <span className={`card-attribute ${isProhibited ? "attr-prohibited" : "attr-permitted"}`}>
            {isProhibited ? <Ban size={13} /> : <CheckCircle size={13} />}
            {isProhibited ? "PROHIBIDO" : "PERMITIDO"}
          </span>
        </div>

        <div className="card-levels">
          {Array.from({ length: stars }).map((_, i) => (
            <div key={i} className="level-star">
              <Orbit size={11} className="star-icon" />
            </div>
          ))}
          <span className="level-label">NIVEL F{stars}</span>
        </div>

        <div className="card-image-box">
          <img src={shakaCosmicImg} alt="Virgo Shaka" className="card-img" loading="lazy" />
          <div className="card-image-lens-flare"></div>
          <div className="card-image-border-glow"></div>
          <div className={`holo-seal ${isProhibited ? "proh" : "perm"}`}>
            <Trophy size={10} />
          </div>
        </div>

        <div className="card-body">
          <div className="card-type">[ CARTA DE LEY MENTAL ]</div>
          <p className="card-description">
            {isProhibited ? (
              <>
                <strong>[Decreto]:</strong> Al entrar en contacto con esta sentencia, la entropía molecular del sujeto se eleva a la masa de Planck. Queda cancelada toda digievolución orgánica.
                Decreto: <em>"{voiceQuote || 'Sucios mortales'}"</em>.
              </>
            ) : (
              <>
                <strong>[Licencia]:</strong> Se concede estabilidad gravitatoria y salvaguarda mental por Virgo Shaka. Autorizado para vagar en materia bariónica.
                Decreto: <em>"{voiceQuote || 'Lo permito...'}"</em>.
              </>
            )}
          </p>

          <div className="card-stats">
            <div className="stat-item">
              <span className="stat-lbl">ENT/</span>
              <span className="stat-val">{entropy || (isProhibited ? 9999 : 0)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-lbl">NV/</span>
              <span className="stat-val">{divineWill || (isProhibited ? "0" : "∞")}</span>
            </div>
            <div className="stat-item">
              <span className="stat-lbl">F/</span>
              <span className="stat-val">{fCategory || 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Export Action Bar */}
      <div className="card-export-bar">
        <div className="export-menu-wrapper">
          <button
            className="export-trigger-btn"
            onClick={() => { playCosmicChime(); setShowExportMenu(!showExportMenu); }}
            disabled={exporting}
          >
            <Download size={14} />
            <span>{exporting ? "Generando HD..." : "DESCARGAR CARTA HD"}</span>
          </button>

          {showExportMenu && (
            <div className="export-dropdown-menu">
              <button onClick={() => handleExportImage("square")} className="export-menu-item">
                <ImageIcon size={14} />
                <span>Formato Carta Coleccionable (1:1)</span>
              </button>
              <button onClick={() => handleExportImage("story")} className="export-menu-item">
                <Sparkles size={14} />
                <span>Formato Historia Instagram (9:16)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(MentalCard);

