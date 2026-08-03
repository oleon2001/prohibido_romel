import React, { useState } from "react";
import { Search, KeyRound, Compass, Sparkles, Eye, EyeOff } from "lucide-react";
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
      <div className="portal-header">
        <div className="mental-title-container">
          <Sparkles className="title-icon" size={24} />
          <h1 className="portal-title">EL CONSEJO MENTAL</h1>
          <Sparkles className="title-icon" size={24} />
        </div>
        <p className="portal-subtitle">
          "Donde la física teórica y el Lost Canvas juzgan tu entropía mortal"
        </p>
      </div>

      <div className="portal-orb-container">
        <div className="portal-orb">
          <div className="orb-core"></div>
          <div className="orb-ring ring-a"></div>
          <div className="orb-ring ring-b"></div>
          <div className="orb-ring ring-c"></div>
        </div>
      </div>

      <div className="portal-actions">
        <form onSubmit={handleSearch} className="portal-form glass-card">
          <h3 className="form-title">
            <Compass size={18} /> ¿Tienes un código de sentencia?
          </h3>
          <div className="input-group">
            <input
              type="text"
              placeholder="Ingresa el ID del juicio (ej. a9b8c7)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="portal-input"
            />
            <button type="submit" className="portal-btn search-btn">
              <Search size={18} />
            </button>
          </div>
        </form>

        <form onSubmit={handleAdminAccess} className="portal-form glass-card">
          <h3 className="form-title">
            <KeyRound size={18} /> Consola del Creador (Romel)
          </h3>
          <div className="input-group input-group-password">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Palabra Clave Divina"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="portal-input"
            />
            <button
              type="button"
              className="portal-btn toggle-pass-btn"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button type="submit" className="portal-btn admin-btn">
              Entrar
            </button>
          </div>
          {errorMsg && <div className="error-text">{errorMsg}</div>}
        </form>
      </div>

      {/* 📜 Muro Astral del Lost Canvas */}
      <AstralWall onSelectJudgment={handleSelectFromWall} />

      <div className="portal-footer">
        <span>SUCIOS MORTALES · SHAKA DE VIRGO · VERCEL READY</span>
      </div>
    </div>
  );
}
