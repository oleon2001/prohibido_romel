import React, { useState } from "react";
import { Disc, Sparkles, Volume2 } from "lucide-react";
import { playCosmicChime, playSharinganHum } from "../services/audioSynth";
import { speakText } from "./CouncilVoices";
import "./ShakaOracle.css";

const ORACLE_QUOTES = [
  "El Tesoro del Cielo ha sellado tu percepción.",
  "Toda materia es sólo una ilusión temporal en el Gran Cosmos.",
  "Las 108 cuentas han cambiado de color... Tu destino se ha fijado.",
  "Aquellos sin voluntad divina sucumbirán a la masa de Planck.",
  "El Creador Romel ha decretado el equilibrio cósmico.",
  "La verdades más profundas se revelan al abrir el ojo interior.",
];

export default function ShakaOracle() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [activeQuote, setActiveQuote] = useState(null);

  const handleSpinOracle = () => {
    if (spinning) return;
    setSpinning(true);
    playSharinganHum();

    const extraSpin = 1440 + Math.floor(Math.random() * 360);
    const newRotation = rotation + extraSpin;
    setRotation(newRotation);

    setTimeout(() => {
      playCosmicChime();
      const randomIndex = Math.floor(Math.random() * ORACLE_QUOTES.length);
      const chosenQuote = ORACLE_QUOTES[randomIndex];
      setActiveQuote(chosenQuote);
      setSpinning(false);
      speakText(chosenQuote, null, 0.5, 0.85);
    }, 2000);
  };

  return (
    <div className="shaka-oracle-container glass-panel-oracle">
      <div className="oracle-header">
        <Disc size={20} className="oracle-icon-glow" />
        <h3 className="oracle-title">EL ROSARIO DE LAS 108 CUENTAS DE SHAKA</h3>
      </div>

      <div className="oracle-wheel-wrapper">
        <div
          className={`oracle-rosario-wheel ${spinning ? "is-spinning" : ""}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rosario-bead"
              style={{ transform: `rotate(${i * 30}deg) translateY(-60px)` }}
            >
              <div className="bead-core"></div>
            </div>
          ))}
          <div className="wheel-center-seal">📿</div>
        </div>

        <button className="spin-oracle-btn" onClick={handleSpinOracle} disabled={spinning}>
          <Sparkles size={16} />
          <span>{spinning ? "Consultando..." : "GIRAR ROSARIO"}</span>
        </button>
      </div>

      {activeQuote && (
        <div className="oracle-quote-box">
          <Volume2 size={16} className="quote-speaker-icon" />
          <p className="oracle-quote-text">"{activeQuote}"</p>
        </div>
      )}
    </div>
  );
}
