import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, PlusCircle, Copy, Check, Radio, Award, AlertOctagon, RefreshCw, Terminal, Sliders, VolumeX, Volume2 } from "lucide-react";
import { saveJudgment, getAllLocalJudgments, generateId } from "../services/store";
import { speakText, VOICE_QUOTES } from "../components/CouncilVoices";
import "./RomelAdmin.css";

export default function RomelAdmin({ setView }) {
  // Form states
  const [mortalName, setMortalName] = useState("");
  const [status, setStatus] = useState("prohibido");
  const [voiceQuote, setVoiceQuote] = useState("sucios_mortales");
  const [entropy, setEntropy] = useState(9999);
  const [quantumLevel, setQuantumLevel] = useState(7);
  const [divineWill, setDivineWill] = useState("0");
  
  // Voice Customizer overrides
  const [customPitch, setCustomPitch] = useState(0.45);
  const [customRate, setCustomRate] = useState(0.8);
  
  // List of judgments and UI states
  const [judgments, setJudgments] = useState([]);
  const [createdUrl, setCreatedUrl] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [pollingActive, setPollingActive] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Terminal console simulation logs state
  const [consoleLogs, setConsoleLogs] = useState([
    `[${new Date().toLocaleTimeString()}] [CONSEJO] Estableciendo enlace con la biblioteca de Lost Canvas...`,
    `[${new Date().toLocaleTimeString()}] [DB] Inicializando canal seguro con kvdb.io...`,
    `[${new Date().toLocaleTimeString()}] [OK] Canal místico establecido.`
  ]);

  const logRef = useRef(null);

  // Add entry to terminal
  const addLog = (text) => {
    setConsoleLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${text}`
    ].slice(-20)); // keep last 20 logs
  };

  // Scroll to bottom of terminal
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  // Adjust defaults based on status
  useEffect(() => {
    if (status === "prohibido") {
      setEntropy(9999);
      setDivineWill("0");
      setVoiceQuote("prohibido");
      setCustomPitch(0.45);
      setCustomRate(0.80);
    } else {
      setEntropy(100);
      setDivineWill("∞");
      setVoiceQuote("permitido");
      setCustomPitch(1.00);
      setCustomRate(1.00);
    }
  }, [status]);

  // Load judgments
  const loadData = async () => {
    setSyncing(true);
    try {
      const data = await getAllLocalJudgments();
      setJudgments(data);
      
      // Look for newly submitted appeals in judgments to alert in terminal
      data.forEach(j => {
        if (j.appealSubmitted && !judgments.some(prev => prev.id === j.id && prev.appealSubmitted)) {
          addLog(`[ALERTA] Mortal ${j.name} ha emitido contraargumentación para ID #${j.id}`);
        }
      });
    } catch (error) {
      console.error("Failed to load judgments:", error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Poll for updates
  useEffect(() => {
    if (!pollingActive) return;
    const interval = setInterval(() => {
      loadData();
    }, 5000);
    return () => clearInterval(interval);
  }, [pollingActive, judgments]);

  // Preview Web Speech API voice with sliders
  const handleVoicePreview = (quoteKey) => {
    const textToSpeak = VOICE_QUOTES[quoteKey]?.text || "";
    speakText(textToSpeak, null, customPitch, customRate);
    addLog(`[VOZ] Reproduciendo pre-escucha: "${textToSpeak}" (PITCH: ${customPitch}, RATE: ${customRate})`);
  };

  // Submit new judgment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mortalName.trim()) return;

    const id = generateId();
    const newJudgment = {
      id,
      name: mortalName.trim(),
      status,
      voiceQuote: VOICE_QUOTES[voiceQuote]?.text || "",
      entropy: parseInt(entropy) || 0,
      divineWill,
      quantumLevel: parseInt(quantumLevel) || 1,
      voicePitch: parseFloat(customPitch),
      voiceRate: parseFloat(customRate),
      creationDate: new Date().toISOString(),
      appeal: "",
      appealSubmitted: false,
    };

    try {
      addLog(`[PROCESO] Sellando juicio para ${newJudgment.name}...`);
      await saveJudgment(newJudgment);
      
      const shareUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;
      setCreatedUrl(shareUrl);
      setMortalName("");
      addLog(`[OK] Juicio #${id} sellado y subido a kvdb.io. Enlace generado.`);
      
      // Speak final decree
      speakText(`¡Decreto sellado! ${newJudgment.name} está ${newJudgment.status === "prohibido" ? "prohibido" : "permitido"}.`, null, customPitch, customRate);

      loadData();
    } catch (err) {
      console.error(err);
      addLog(`[ERROR] Falló la sincronización con el hiperespacio.`);
    }
  };

  // Quick toggle status
  const handleToggleStatus = async (judgment) => {
    const nextStatus = judgment.status === "prohibido" ? "permitido" : "prohibido";
    const updated = {
      ...judgment,
      status: nextStatus,
      entropy: nextStatus === "prohibido" ? 9999 : 120,
      divineWill: nextStatus === "prohibido" ? "0" : "∞",
    };
    
    addLog(`[MODIFICACIÓN] Alterando destino de ${judgment.name} a ${nextStatus.toUpperCase()}`);
    speakText(`Destino alterado para ${updated.name}`, null, updated.voicePitch, updated.voiceRate);

    await saveJudgment(updated);
    loadData();
  };

  // Copy share URL
  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addLog(`[PORTAPAPELES] Enlace copiado para ID #${id}`);
    setTimeout(() => setCopiedId(""), 2000);
  };

  return (
    <div className="admin-container">
      {/* Admin header */}
      <div className="admin-header">
        <button onClick={() => setView("portal")} className="back-portal-btn">
          <ArrowLeft size={16} /> Volver al Portal
        </button>
        <h1 className="admin-title">CABINA DE CONTROL CUÁNTICA</h1>
        <p className="admin-subtitle">
          Configura las frecuencias del Consejo, altera las leyes termodinámicas y juzga a los mortales en vivo.
        </p>
      </div>

      <div className="admin-grid">
        {/* Left Column: Form + Terminal */}
        <div className="admin-left-col">
          {/* Card 1: Setup Judgment */}
          <div className="admin-card glass-panel">
            <h2 className="panel-title">
              <PlusCircle size={18} className="glow-icon" /> Sellar Nueva Sentencia
            </h2>
            <form onSubmit={handleSubmit} className="judgment-form">
              <div className="form-group">
                <label>Nombre del Mortal:</label>
                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={mortalName}
                  onChange={(e) => setMortalName(e.target.value)}
                  required
                  className="admin-input"
                />
              </div>

              <div className="form-group">
                <label>Sentencia:</label>
                <div className="toggle-container">
                  <button
                    type="button"
                    onClick={() => setStatus("prohibido")}
                    className={`toggle-btn btn-prohibido ${status === "prohibido" ? "active" : ""}`}
                  >
                    <AlertOctagon size={14} /> PROHIBIDO
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("permitido")}
                    className={`toggle-btn btn-permitido ${status === "permitido" ? "active" : ""}`}
                  >
                    <Award size={14} /> PERMITIDO
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Susurro del Consejo:</label>
                <div className="voice-selector">
                  <select
                    value={voiceQuote}
                    onChange={(e) => setVoiceQuote(e.target.value)}
                    className="admin-select"
                  >
                    {Object.keys(VOICE_QUOTES).map((key) => (
                      <option key={key} value={key}>
                        {VOICE_QUOTES[key].text}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleVoicePreview(voiceQuote)}
                    className="preview-voice-btn"
                  >
                    Escuchar
                  </button>
                </div>
              </div>

              {/* Advanced Voice Synthesizer Controls */}
              <div className="voice-tuner-box">
                <div className="tuner-title">
                  <Sliders size={12} /> Modulador de Frecuencia Esquizofrenica
                </div>
                
                <div className="tuner-slider-group">
                  <div className="tuner-label">
                    <span>Tono (Pitch): {customPitch.toFixed(2)}</span>
                    <span className="unit-label">{customPitch < 0.8 ? "Tétrico" : customPitch > 1.3 ? "Histérico" : "Robótico"}</span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="2.0"
                    step="0.05"
                    value={customPitch}
                    onChange={(e) => setCustomPitch(parseFloat(e.target.value))}
                    className="admin-range pitch-range"
                  />
                </div>

                <div className="tuner-slider-group">
                  <div className="tuner-label">
                    <span>Velocidad (Rate): {customRate.toFixed(2)}</span>
                    <span className="unit-label">{customRate < 0.8 ? "Lento" : "Fracaso Spacing"}</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={customRate}
                    onChange={(e) => setCustomRate(parseFloat(e.target.value))}
                    className="admin-range rate-range"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half-width">
                  <label>LVL Cuántico:</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={quantumLevel}
                    onChange={(e) => setQuantumLevel(e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="form-group half-width">
                  <label>Voluntad Divina (VD):</label>
                  <input
                    type="text"
                    value={divineWill}
                    onChange={(e) => setDivineWill(e.target.value)}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Entropía Asignada (ENT): {entropy}</label>
                <input
                  type="range"
                  min="0"
                  max="9999"
                  step="50"
                  value={entropy}
                  onChange={(e) => setEntropy(e.target.value)}
                  className="admin-range main-entropy-slider"
                />
              </div>

              <button type="submit" className="submit-judgment-btn">
                Sellar Sentencia y Subir a kvdb.io
              </button>
            </form>

            {createdUrl && (
              <div className="url-result-box">
                <div className="url-result-label">¡Enlace Sincronizado en kvdb.io!</div>
                <div className="url-copy-row">
                  <input type="text" readOnly value={createdUrl} className="url-output" />
                  <button
                    onClick={() => copyToClipboard(createdUrl, "new")}
                    className="copy-btn"
                  >
                    {copiedId === "new" ? <Check size={18} color="#00ffcc" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Terminal Console Simulated Logs */}
          <div className="admin-card glass-panel terminal-card">
            <div className="terminal-header">
              <Terminal size={14} />
              <span>REGISTRO DE FLUJO DE ENTROPÍA (LOGS ASTRAL)</span>
            </div>
            <div ref={logRef} className="terminal-content">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="terminal-line">{log}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Active Judgments */}
        <div className="admin-card glass-panel flex-column active-registry-panel">
          <div className="panel-header-row">
            <h2 className="panel-title">
              <Radio size={18} className="glow-icon-blue" /> Registro en Tiempo Real
            </h2>
            <div className="sync-indicator">
              <button onClick={loadData} disabled={syncing} className="refresh-btn">
                <RefreshCw size={14} className={syncing ? "spin-icon" : ""} />
              </button>
              <span>{syncing ? "Actualizando..." : "Sincronizado (5s)"}</span>
            </div>
          </div>

          <div className="judgments-list">
            {judgments.length === 0 ? (
              <div className="empty-list-message">
                No hay decretos activos en la red cuántica. Configura uno a la izquierda.
              </div>
            ) : (
              judgments.map((j) => {
                const link = `${window.location.origin}${window.location.pathname}?id=${j.id}`;
                return (
                  <div key={j.id} className={`judgment-row-card ${j.status}`}>
                    <div className="row-main-info">
                      <div className="row-meta">
                        <span className="row-id">ID: #{j.id}</span>
                        <span className="row-date">
                          {new Date(j.creationDate).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="row-name-status">
                        <span className="row-mortal-name">{j.name}</span>
                        <button
                          onClick={() => handleToggleStatus(j)}
                          className={`row-status-pill ${j.status}`}
                          title="Click para cambiar destino"
                        >
                          {j.status.toUpperCase()}
                        </button>
                      </div>
                      <div className="row-stats-preview">
                        ENT: {j.entropy} | VD: {j.divineWill} | LVL: {j.quantumLevel} | PITCH: {j.voicePitch?.toFixed(2)}
                      </div>
                    </div>

                    <div className="row-appeal-section">
                      {j.appealSubmitted ? (
                        <div className="appeal-box-wrapper">
                          <div className="appeal-header">Descargo Recibido:</div>
                          <p className="appeal-text-content">"{j.appeal}"</p>
                        </div>
                      ) : (
                        <div className="no-appeal-yet">Esperando descargos del mortal...</div>
                      )}
                    </div>

                    <div className="row-actions">
                      <button
                        onClick={() => copyToClipboard(link, j.id)}
                        className="row-action-btn"
                      >
                        {copiedId === j.id ? (
                          <>
                            <Check size={12} color="#00ffcc" /> Copiado
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> Copiar Enlace
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
