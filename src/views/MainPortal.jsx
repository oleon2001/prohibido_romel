import React, { useState } from "react";
import { Search, KeyRound, Compass, Sparkles, Eye, EyeOff, ShieldAlert, Orbit, Flame } from "lucide-react";
import AstralWall from "../components/AstralWall";
import "./MainPortal.css";

export default function MainPortal({ setView, setJudgmentId }) {
  const [searchId, setSearchId] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      setJudgmentId(searchId.trim());
      setView("recipient");
    }
  };

  const handleAdminAccess = (e) => {
    e.preventDefault();
    const key = adminKey.trim().toLowerCase();
    if (key === "revelacion esquizofrenica") {
      setView("admin");
    } else {
      setErrorMsg("El Consejo no reconoce esa frecuencia vibracional.");
      setTimeout(() => setErrorMsg(""), 3000);
    }
  };

  const handleSelectFromWall = (id) => {
    setJudgmentId(id);
    setView("recipient");
  };

  return (
    <div className="portal-container">
      {/* Top Sacred Eyebrow Badge */}
      <div className="portal-header">
        <div className="portal-sacred-badge">
          <Orbit size={13} className="badge-spin-icon" />
          <span>TRIBUNAL FÍSICO-ASTRAL · LOST CANVAS · SHAKA DE VIRGO</span>
          <Flame size={13} className="badge-flame-icon" />
        </div>

        <div className="mental-title-container">
          <span className="title-filigree left" />
          <Sparkles className="title-icon" size={26} />
          <h1 className="portal-title">EL CONSEJO MENTAL</h1>
          <Sparkles className="title-icon" size={26} />
          <span className="title-filigree right" />
        </div>

        <p className="portal-subtitle">
          "Donde la física teórica, el Tsukuyomi y el Lost Canvas juzgan tu entropía mortal"
        </p>

        <div className="portal-concept-pills">
          <span className="concept-pill gold">☸ Tesoro del Cielo (108 Cuentas)</span>
          <span className="concept-pill cyan">⚛ Singularidad de Dirac δ(x)</span>
          <span className="concept-pill crimson">👁 Decreto del Creador Romel</span>
        </div>
      </div>

      {/* Central Cosmic Astrolabe & Quantum Singularity Core */}
      <div className="portal-orb-container">
        <div className="astrolabe-telemetry telemetry-left">
          <span className="tel-label">ECUACIÓN DE ESTADO</span>
          <span className="tel-val">iℏ ∂Ψ/∂t = ĤΨ</span>
        </div>

        <div className="portal-orb">
          <svg className="astrolabe-svg-outer" viewBox="0 0 260 260">
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd700" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#e63946" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <circle cx="130" cy="130" r="122" fill="none" stroke="url(#goldGrad)" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="130" cy="130" r="106" fill="none" stroke="rgba(255,215,0,0.25)" strokeWidth="1" />
            {/* Sacred Octagram Star */}
            <polygon
              points="130,18 158,92 235,92 172,138 196,214 130,168 64,214 88,138 25,92 102,92"
              fill="none"
              stroke="rgba(255, 215, 0, 0.14)"
              strokeWidth="0.9"
            />
          </svg>

          <div className="orb-ring ring-c"></div>
          <div className="orb-ring ring-b"></div>
          <div className="orb-ring ring-a"></div>

          <div className="orb-core">
            <div className="orb-inner-eye">
              <div className="orb-iris">
                <div className="orb-pupil"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="astrolabe-telemetry telemetry-right">
          <span className="tel-label">ENTROPÍA BASE</span>
          <span className="tel-val">S = k_B ln Ω</span>
        </div>
      </div>

      {/* Main Dual Action Cards */}
      <div className="portal-actions">
        {/* Mortal Consultation Card */}
        <form onSubmit={handleSearch} className="portal-form glass-card card-mortal">
          <div className="card-corner corner-tl"></div>
          <div className="card-corner corner-tr"></div>
          <div className="card-corner corner-bl"></div>
          <div className="card-corner corner-br"></div>

          <div className="card-top-meta">
            <span className="card-kicker cyan-kicker">VERIFICACIÓN DE DESTINO</span>
            <span className="card-glyph">☸</span>
          </div>

          <div className="card-head-block">
            <h3 className="form-title">
              <Compass size={19} className="title-icon-cyan" /> ¿Tienes un Código de Sentencia?
            </h3>
            <p className="form-desc">
              Introduce el identificador cuántico asignado a tu alma para abrir tu Carta de Ley Mental.
            </p>
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Ingresa el ID del juicio (ej. a9b8c7)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="portal-input"
            />
            <button type="submit" className="portal-btn search-btn" title="Consultar Sentencia">
              <Search size={17} />
              <span>Consultar</span>
            </button>
          </div>
        </form>

        {/* Creator Console Card (Romel / Madara) */}
        <form onSubmit={handleAdminAccess} className="portal-form glass-card card-creator">
          <div className="card-corner corner-tl"></div>
          <div className="card-corner corner-tr"></div>
          <div className="card-corner corner-bl"></div>
          <div className="card-corner corner-br"></div>

          <div className="card-top-meta">
            <span className="card-kicker crimson-kicker">ACCESO RESTRINGIDO · TSUKUYOMI</span>
            <span className="card-glyph crimson-glyph">封</span>
          </div>

          <div className="card-head-block">
            <h3 className="form-title creator-title">
              <KeyRound size={19} className="title-icon-crimson" /> Consola del Creador (Romel)
            </h3>
            <p className="form-desc">
              Santuario de mando para forjar decretos, escanear entropía y alterar el destino mortal.
            </p>
          </div>

          <div className="input-group input-group-password">
            <div className="password-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Palabra Clave Divina"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="portal-input creator-input"
              />
              <button
                type="button"
                className="toggle-pass-inline"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" className="portal-btn admin-btn">
              <span>Entrar</span>
            </button>
          </div>
          {errorMsg && (
            <div className="error-text">
              <ShieldAlert size={14} />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>
      </div>

      {/* 📜 Muro Astral del Lost Canvas */}
      <AstralWall onSelectJudgment={handleSelectFromWall} />

      <footer className="portal-footer">
        <div className="footer-ornament-line" />
        <div className="footer-content">
          <span>SUCIOS MORTALES</span>
          <span className="footer-dot">◆</span>
          <span>SHAKA DE VIRGO & MADARA UCHIHA</span>
          <span className="footer-dot">◆</span>
          <span>ENTROPÍA CUÁNTICA EN VIVO</span>
        </div>
      </footer>
    </div>
  );
}
