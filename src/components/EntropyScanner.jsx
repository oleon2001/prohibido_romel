import React, { useState } from "react";
import { Scan, Zap, AlertTriangle, ShieldCheck, RefreshCw, ArrowRight, Dices } from "lucide-react";
import { playCosmicChime, playSharinganHum } from "../services/audioSynth";
import "./EntropyScanner.css";

const RANDOM_NAMES = ["Mortal Desconocido", "Cosmo Efímero", "Sujeto Alfa-9", "Alma Vagabunda", "Espíritu Inestable"];

export default function EntropyScanner({ onScanComplete }) {
  const [subjectName, setSubjectName] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleStartScan = (nameToScan) => {
    const targetName = typeof nameToScan === "string" ? nameToScan : subjectName;
    if (!targetName.trim()) return;

    setScanning(true);
    setScanResult(null);
    playSharinganHum();

    setTimeout(() => {
      playCosmicChime();

      let hash = 0;
      for (let i = 0; i < targetName.length; i++) {
        hash = targetName.charCodeAt(i) + ((hash << 5) - hash);
      }
      const absHash = Math.abs(hash);

      const calculatedEntropy = (absHash % 9000) + 1000;
      const calculatedWill = (absHash % 99) + 1;
      const fLevel = (absHash % 5) + 1;
      const projectedStatus = calculatedEntropy > 5000 ? "prohibido" : "permitido";
      const planckMass = (calculatedEntropy * 2.176e-8).toExponential(3);

      const result = {
        name: targetName,
        entropy: calculatedEntropy,
        divineWill: calculatedWill,
        fCategory: fLevel,
        planckMass,
        status: projectedStatus,
      };

      setScanResult(result);
      setScanning(false);
    }, 2000);
  };

  const handleRandomScan = () => {
    const randomName = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    setSubjectName(randomName);
    handleStartScan(randomName);
  };

  const handleApplyToForm = () => {
    if (scanResult && onScanComplete) {
      playCosmicChime();
      onScanComplete(scanResult);
    }
  };

  return (
    <div className="entropy-scanner-container glass-panel-scan">
      <div className="scanner-header">
        <Scan size={20} className="scanner-icon-glow" />
        <h3 className="scanner-title">ESCÁNER BIOMÉTRICO DE ENTROPÍA</h3>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleStartScan(); }} className="scanner-form">
        <div className="scanner-input-wrapper">
          <input
            type="text"
            placeholder="Introduce el nombre del mortal..."
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            disabled={scanning}
            className="scanner-input"
            required
          />
          <button type="submit" disabled={scanning || !subjectName.trim()} className="scan-trigger-btn">
            {scanning ? <RefreshCw size={16} className="spin-icon" /> : <Zap size={16} />}
            <span>{scanning ? "Escaneando..." : "ESCANEAR"}</span>
          </button>
          <button
            type="button"
            onClick={handleRandomScan}
            disabled={scanning}
            className="scan-random-btn"
            title="Escanear Alma Aleatoria"
          >
            <Dices size={16} />
          </button>
        </div>
      </form>

      {/* Laser Scanning Visualizer */}
      {scanning && (
        <div className="laser-box">
          <div className="laser-beam"></div>
          <div className="laser-grid"></div>
          <p className="laser-status-txt">ANALIZANDO MATRIZ DE ESPÍN CUÁNTICO...</p>
        </div>
      )}

      {/* Scan Results Display */}
      {scanResult && !scanning && (
        <div className={`scan-result-card ${scanResult.status}`}>
          <div className="result-header">
            <span className="result-subject">{scanResult.name}</span>
            <span className={`result-status-badge ${scanResult.status}`}>
              {scanResult.status === "prohibido" ? (
                <>
                  <AlertTriangle size={13} /> RIESGO: PROHIBIDO
                </>
              ) : (
                <>
                  <ShieldCheck size={13} /> ESTABLE: PERMITIDO
                </>
              )}
            </span>
          </div>

          <div className="result-metrics-grid">
            <div className="metric-box">
              <span className="metric-lbl">ENTROPÍA</span>
              <span className="metric-val">{scanResult.entropy} S/k</span>
            </div>
            <div className="metric-box">
              <span className="metric-lbl">VOLUNTAD</span>
              <span className="metric-val">{scanResult.divineWill} NV</span>
            </div>
            <div className="metric-box">
              <span className="metric-lbl">NIVEL F</span>
              <span className="metric-val">F{scanResult.fCategory}</span>
            </div>
            <div className="metric-box">
              <span className="metric-lbl">MASA PLANCK</span>
              <span className="metric-val">{scanResult.planckMass} kg</span>
            </div>
          </div>

          {onScanComplete && (
            <button type="button" onClick={handleApplyToForm} className="apply-scan-to-form-btn">
              <span>UTILIZAR PARÁMETROS EN EL FORMULARIO</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
