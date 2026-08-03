import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, PlusCircle, Copy, Check, Radio, Award, AlertOctagon, Orbit, RefreshCw, Terminal, Sliders, Search, LayoutGrid, List, ChevronDown, X, Share, Scan, Disc } from "lucide-react";
import { saveJudgment, getAllLocalJudgments, generateId, deleteJudgment, encodeJudgmentToUrl } from "../services/store";
import { speakText, VOICE_QUOTES } from "../components/CouncilVoices";
import { playSharinganHum, playCosmicChime } from "../services/audioSynth";
import EntropyScanner from "../components/EntropyScanner";
import ShakaOracle from "../components/ShakaOracle";
import "./RomelAdmin.css";

export default function RomelAdmin({ setView }) {
  const [mortalName, setMortalName] = useState("");
  const [status, setStatus] = useState("prohibido");
  const [voiceQuote, setVoiceQuote] = useState("sucios_mortales");
  const [entropy, setEntropy] = useState(9999);
  const [divineWill, setDivineWill] = useState("0");
  const [fCategory, setFCategory] = useState("1");

  const [customPitch, setCustomPitch] = useState(0.45);
  const [customRate, setCustomRate] = useState(0.8);

  const [judgments, setJudgments] = useState([]);
  const [createdUrl, setCreatedUrl] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const [digivolvingSubmit, setDigivolvingSubmit] = useState(false);
  const [digivolvingRowId, setDigivolvingRowId] = useState(null);
  const [tsukuyomiFlash, setTsukuyomiFlash] = useState(false);
  const [adminSubTab, setAdminSubTab] = useState("form"); // form, scanner, oracle

  const [viewMode, setViewMode] = useState("grid");
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [unreadLogs, setUnreadLogs] = useState(0);

  const [voiceSectionOpen, setVoiceSectionOpen] = useState(false);
  const [tunerSectionOpen, setTunerSectionOpen] = useState(false);

  const [consoleLogs, setConsoleLogs] = useState([
    `[${new Date().toLocaleTimeString()}] [RINNEGAN] ojo celestial activo.`,
    `[${new Date().toLocaleTimeString()}] [SUSANOO] Círculo de Prohibición desplegado.`,
    `[${new Date().toLocaleTimeString()}] [OK] Conectado al flujo del Tsukuyomi.`
  ]);

  const logRef = useRef(null);

  const handleScanFill = (result) => {
    setMortalName(result.name);
    setStatus(result.status);
    setEntropy(result.entropy);
    setDivineWill(result.divineWill.toString());
    setFCategory(result.fCategory.toString());
    setAdminSubTab("form");
    addLog(`[ESCÁNER] Cargar parámetros cuánticos para ${result.name}`);
  };

  const handleHeaderSharinganClick = () => {
    playSharinganHum();
    setTsukuyomiFlash(true);
    setTimeout(() => setTsukuyomiFlash(false), 800);
    addLog(`[RINNEGAN] Ojo celestial activado.`);
  };

  const addLog = (text) => {
    setConsoleLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${text}`
    ].slice(-30));
    if (!terminalOpen) {
      setUnreadLogs((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [consoleLogs]);

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

  const loadData = useCallback(async () => {
    setSyncing(true);
    try {
      const data = await getAllLocalJudgments();

      data.forEach(j => {
        if (j.appealSubmitted && !judgments.some(prev => prev.id === j.id && prev.appealSubmitted)) {
          addLog(`[APELACIÓN] ${j.name} ha emitido contraargumentación para ID #${j.id}`);
        }
        if (j.seen && !judgments.some(prev => prev.id === j.id && prev.seen)) {
          addLog(`[👁️ ALERTA DE VISTO] ¡${j.name} ha abierto su decreto mental en vivo!`);
          speakText(`¡Atención Creador Romel! ${j.name} acaba de abrir su decreto mental.`, null, 0.9, 1.0);
        }
      });

      setJudgments(data);
    } catch (error) {
      console.error("Failed to load judgments:", error);
    } finally {
      setSyncing(false);
    }
  }, [judgments]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleVoicePreview = (quoteKey) => {
    const textToSpeak = VOICE_QUOTES[quoteKey]?.text || "";
    speakText(textToSpeak, null, customPitch, customRate);
    addLog(`[VOZ] Pre-escucha: "${textToSpeak}"`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mortalName.trim()) return;

    setDigivolvingSubmit(true);

    const tempId = generateId();
    const newJudgment = {
      id: tempId,
      name: mortalName.trim(),
      status,
      voiceQuote: VOICE_QUOTES[voiceQuote]?.text || "",
      entropy: parseInt(entropy) || 0,
      divineWill,
      fCategory: parseInt(fCategory) || 1,
      voicePitch: parseFloat(customPitch),
      voiceRate: parseFloat(customRate),
      creationDate: new Date().toISOString(),
      appeal: "",
      appealSubmitted: false,
    };

    try {
      addLog(`[TSUKUYOMI] Sellando decreto para ${newJudgment.name}...`);
      const saved = await saveJudgment(newJudgment);

      setTimeout(() => {
        const finalId = saved.id || tempId;
        const encodedData = encodeJudgmentToUrl(saved);
        const shareUrl = `${window.location.origin}${window.location.pathname}?id=${finalId}&d=${encodedData}`;
        setCreatedUrl(shareUrl);
        setMortalName("");
        setDigivolvingSubmit(false);
        addLog(`[OK] Juicio #${finalId} sellado en la nube. Enlace generado.`);

        speakText(`¡Decreto sellado! ${saved.name} está ${saved.status === "prohibido" ? "prohibido" : "permitido"}.`, null, customPitch, customRate);

        loadData();
      }, 2000);

    } catch (err) {
      console.error(err);
      setDigivolvingSubmit(false);
      addLog(`[ERROR] Falló la sincronización.`);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Deseas erradicar el decreto para ${name}?`)) {
      addLog(`[ERRADICACIÓN] Borrando juicio ID #${id}`);
      await deleteJudgment(id);
      loadData();
    }
  };

  const handleToggleStatus = async (judgment) => {
    setDigivolvingRowId(judgment.id);

    const nextStatus = judgment.status === "prohibido" ? "permitido" : "prohibido";
    const updated = {
      ...judgment,
      status: nextStatus,
      entropy: nextStatus === "prohibido" ? 9999 : 120,
      divineWill: nextStatus === "prohibido" ? "0" : "∞",
    };

    addLog(`[SHARINGAN] Alterando destino de ${judgment.name} a ${nextStatus.toUpperCase()}`);
    speakText(`Destino alterado para ${updated.name}`, null, updated.voicePitch, updated.voiceRate);

    setTimeout(async () => {
      await saveJudgment(updated);
      loadData();
      setDigivolvingRowId(null);
    }, 1000);
  };

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    addLog(`[PORTAPAPELES] Enlace copiado para ID #${id}`);
    setTimeout(() => setCopiedId(""), 2000);
  };

  const shareWhatsApp = (url, name, statusText) => {
    const msg = encodeURIComponent(`⚡ DECRETO DE MADARA UCHIHA ⚡\n\n${name}\nSentencia: ${statusText}\n\nRevisa tu destino: ${url}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    addLog(`[WHATSAPP] Compartiendo decreto de juicio a ${name}`);
  };

  const prohibitedCount = judgments.filter(j => j.status === "prohibido").length;
  const permittedCount = judgments.filter(j => j.status === "permitido").length;
  const appealCount = judgments.filter(j => j.appealSubmitted).length;

  const filteredJudgments = judgments.filter(j => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return j.name.toLowerCase().includes(q) || j.id.toLowerCase().includes(q);
  });

  return (
    <div className="admin-container">
      {digivolvingSubmit && (
        <div className="digivolve-admin-overlay">
          <div className="digi-data-stream stream-1"></div>
          <div className="digi-data-stream stream-2"></div>
          <div className="digi-data-stream stream-3"></div>
          <div className="digi-rings-container">
            <div className="digi-ring-admin r1"></div>
            <div className="digi-ring-admin r2"></div>
            <div className="digi-ring-admin r3"></div>
          </div>
          <div className="digi-admin-text">
            ¡{mortalName.toUpperCase()} DIGIEVOLUCIONA!
          </div>
          <div className="digi-admin-subtext">WARP DIGIVOLUTION...</div>
        </div>
      )}

      <div className="gunbai-watermark">
        <svg viewBox="0 0 100 100">
          <ellipse cx="50" cy="55" rx="25" ry="35" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
          <line x1="50" y1="20" x2="50" y2="5" stroke="currentColor" strokeWidth="2"/>
          <ellipse cx="50" cy="55" rx="12" ry="18" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="50" cy="55" r="4" fill="currentColor" opacity="0.3"/>
        </svg>
      </div>

      {tsukuyomiFlash && <div className="tsukuyomi-flash-overlay"></div>}

      <div className="admin-header">
        <button onClick={() => setView("portal")} className="back-portal-btn">
          <ArrowLeft size={16} /> Volver al Portal
        </button>
        
        <div className="sharingan-header-eye" onClick={handleHeaderSharinganClick} title="Ojo Celestial de Madara (Click para activar Tsukuyomi)">
          <div className="sharingan-pupil"></div>
        </div>

        <h1 className="admin-title">CONSEJO DE MADARA UCHIHA</h1>
        <p className="admin-subtitle">
          "El verdadero infierno es la realidad... Solo la ilusión puede ser perfecta."
        </p>
      </div>

      {/* Admin Sub-Tool Tabs */}
      <div className="admin-subtabs-bar">
        <button
          className={`admin-subtab-btn ${adminSubTab === "form" ? "active" : ""}`}
          onClick={() => { playCosmicChime(); setAdminSubTab("form"); }}
        >
          <PlusCircle size={14} /> FORJAR DECRETO
        </button>
        <button
          className={`admin-subtab-btn ${adminSubTab === "scanner" ? "active" : ""}`}
          onClick={() => { playCosmicChime(); setAdminSubTab("scanner"); }}
        >
          <Scan size={14} /> ESCÁNER CUÁNTICO
        </button>
        <button
          className={`admin-subtab-btn ${adminSubTab === "oracle" ? "active" : ""}`}
          onClick={() => { playCosmicChime(); setAdminSubTab("oracle"); }}
        >
          <Disc size={14} /> ROSARIO DE SHAKA
        </button>
      </div>

      <div className="stats-bar">
        <div className="stat-badge"><span className="dot dot-prohibited"></span> {prohibitedCount} Prohibidos</div>
        <div className="stat-badge"><span className="dot dot-permitted"></span> {permittedCount} Permitidos</div>
        <div className="stat-badge"><span className="dot dot-appeals"></span> {appealCount} Apelaciones</div>
      </div>

      <div className="admin-grid">
        <div className="admin-left-col">
          {adminSubTab === "scanner" && (
            <EntropyScanner onScanComplete={handleScanFill} />
          )}

          {adminSubTab === "oracle" && (
            <ShakaOracle />
          )}

          {adminSubTab === "form" && (
            <div className="admin-card glass-panel madara-card">
              <div className="wax-seal"></div>
              <div className="sharingan-overlay"></div>
              <h2 className="panel-title">
                <PlusCircle size={18} className="glow-icon-madara" /> Sellar Nueva Sentencia
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

              <div className="form-row">
                <div className="form-group half-width">
                  <label>¿A qué F pertenece?</label>
                  <select
                    value={fCategory}
                    onChange={(e) => setFCategory(e.target.value)}
                    className="admin-select"
                  >
                    <option value="1">F1</option>
                    <option value="2">F2</option>
                    <option value="3">F3</option>
                    <option value="4">F4</option>
                    <option value="5">F5</option>
                  </select>
                </div>

                <div className="form-group half-width">
                  <label>Nivel de Voluntad:</label>
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

              <div className="accordion-section">
                <div className="accordion-header" onClick={() => setVoiceSectionOpen(!voiceSectionOpen)}>
                  <span>Susurro del Consejo</span>
                  <ChevronDown size={14} className={`chevron ${voiceSectionOpen ? "open" : ""}`} />
                </div>
                <div className={`accordion-content ${voiceSectionOpen ? "open" : ""}`}>
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
              </div>

              <div className="accordion-section">
                <div className="accordion-header" onClick={() => setTunerSectionOpen(!tunerSectionOpen)}>
                  <span>Modulador de Frecuencia Esquizofrénica</span>
                  <ChevronDown size={14} className={`chevron ${tunerSectionOpen ? "open" : ""}`} />
                </div>
                <div className={`accordion-content ${tunerSectionOpen ? "open" : ""}`}>
                  <div className="voice-tuner-box">
                    <div className="tuner-title">
                      <Sliders size={12} /> Parámetros de Voz
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
                        <span className="unit-label">{customRate < 0.8 ? "Lento" : "Rápido"}</span>
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
                </div>
              </div>

              <button type="submit" className="submit-judgment-btn">
                INVOCAR TSUKUYOMI INFINITO
              </button>
            </form>

            {createdUrl && (
              <div className="url-result-box">
                <div className="url-result-label">¡Enlace Sincronizado en la Nube Cuántica!</div>
                <div className="url-copy-row">
                  <input type="text" readOnly value={createdUrl} className="url-output" />
                  <button
                    onClick={() => copyToClipboard(createdUrl, "new")}
                    className="copy-btn"
                  >
                    {copiedId === "new" ? <Check size={18} color="#00ffcc" /> : <Copy size={18} />}
                  </button>
                  <button
                    onClick={() => shareWhatsApp(createdUrl, mortalName, status === "prohibido" ? "PROHIBIDO" : "PERMITIDO")}
                    className="copy-btn whatsapp-btn"
                    title="Compartir por WhatsApp"
                  >
                    <Share size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
          )}

          <div className={`admin-card glass-panel terminal-card ${!terminalOpen ? "collapsed" : ""}`}>
            <div className="terminal-header" onClick={() => { setTerminalOpen(!terminalOpen); if (!terminalOpen) setUnreadLogs(0); }}>
              <div className="terminal-header-left">
                <Terminal size={14} />
                <span>REGISTRO DEL SHARINGAN ETERNO</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!terminalOpen && unreadLogs > 0 && (
                  <span className="terminal-badge">{unreadLogs} nuevos</span>
                )}
                <ChevronDown size={12} className={`chevron ${terminalOpen ? "open" : ""}`} />
              </div>
            </div>
            <div ref={logRef} className="terminal-content">
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="terminal-line">{log}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card glass-panel flex-column active-registry-panel">
          <div className="panel-header-row">
            <h2 className="panel-title">
              <Radio size={18} className="glow-icon-blue" /> Registro de Decretos
            </h2>
            <div className="panel-header-actions">
              <div className="view-toggle-group">
                <button
                  className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Vista de Cartas"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="Vista de Lista"
                >
                  <List size={15} />
                </button>
              </div>
              <div className="sync-indicator">
                <button onClick={loadData} disabled={syncing} className="refresh-btn">
                  <RefreshCw size={14} className={syncing ? "spin-icon" : ""} />
                </button>
                <span>{syncing ? "Sincronizando..." : "5s"}</span>
              </div>
            </div>
          </div>

          <div className="search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar mortal o ID..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {viewMode === "grid" ? (
            <div className="judgments-deck">
              {filteredJudgments.length === 0 ? (
                <div className="empty-list-message">
                  {filterQuery ? "Sin resultados." : "No hay decretos activos. Sella uno a la izquierda."}
                </div>
              ) : (
                filteredJudgments.map((j) => {
                  const link = `${window.location.origin}${window.location.pathname}?id=${j.id}&d=${encodeJudgmentToUrl(j)}`;
                  const isDigivolving = digivolvingRowId === j.id;
                  const stars = Math.min(5, Math.max(1, j.fCategory || 1));

                  return (
                    <div
                      key={j.id}
                      className={`mini-card ${j.status} ${isDigivolving ? "digivolving-row" : ""}`}
                    >
                      <div className="card-mini-foil"></div>
                      {j.appealSubmitted && <div className="mini-card-appeal-badge"></div>}

                      <div className="mini-card-top">
                        <span className="mini-card-id">#{j.id.substring(0, 6)}</span>
                        {j.seen ? (
                          <span className="telemetry-pill seen" title={`Visto ${j.viewCount || 1} veces`}>
                            👁️ {j.viewCount || 1}x
                          </span>
                        ) : (
                          <span className="telemetry-pill unread" title="El mortal no ha abierto la sentencia">
                            ⏳ Pendiente
                          </span>
                        )}
                        <button className="mini-card-delete" onClick={(e) => { e.stopPropagation(); handleDelete(j.id, j.name); }} title="Eliminar">
                          <X size={12} />
                        </button>
                      </div>

                      <div className="mini-card-name">{j.name}</div>

                      <div className="mini-card-stars">
                        {Array.from({ length: stars }).map((_, i) => (
                          <Orbit key={i} size={10} className="mini-star" />
                        ))}
                      </div>

                      <div className="mini-card-stats">
                        <span>⚡{j.divineWill}</span>
                        <span>🔥{j.entropy}</span>
                      </div>

                      <div className="mini-card-bottom">
                        <button
                          onClick={() => handleToggleStatus(j)}
                          className={`mini-status-pill ${j.status}`}
                        >
                          {j.status === "prohibido" ? "PROHIBIDO" : "PERMITIDO"}
                        </button>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            className="mini-card-copy"
                            onClick={(e) => { e.stopPropagation(); shareWhatsApp(link, j.name, j.status.toUpperCase()); }}
                            title="Compartir por WhatsApp"
                          >
                            <Share size={14} />
                          </button>
                          <button
                            className="mini-card-copy"
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(link, j.id); }}
                          >
                            {copiedId === j.id ? <Check size={14} color="#00ffcc" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="judgments-list">
              {filteredJudgments.length === 0 ? (
                <div className="empty-list-message">
                  {filterQuery ? "Sin resultados." : "No hay decretos activos. Sella uno a la izquierda."}
                </div>
              ) : (
                filteredJudgments.map((j) => {
                  const link = `${window.location.origin}${window.location.pathname}?id=${j.id}&d=${encodeJudgmentToUrl(j)}`;
                  const isDigivolving = digivolvingRowId === j.id;
                  return (
                    <div
                      key={j.id}
                      className={`judgment-row-card ${j.status} ${isDigivolving ? "digivolving-row" : ""}`}
                    >
                      {isDigivolving && (
                        <div className="row-digivolve-overlay">
                          <div className="row-digi-rings">
                            <span className="mini-ring"></span>
                            <span className="mini-ring"></span>
                          </div>
                          <span className="row-digi-text">DIGIEVOLUCIONANDO...</span>
                        </div>
                      )}
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
                          ENT: {j.entropy} | NV: {j.divineWill} | F: {j.fCategory || 1} | PITCH: {j.voicePitch?.toFixed(2)}
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
                          onClick={() => shareWhatsApp(link, j.name, j.status.toUpperCase())}
                          className="row-action-btn"
                          style={{ marginRight: '12px' }}
                        >
                          <Share size={12} /> WhatsApp
                        </button>
                        <button
                          onClick={() => copyToClipboard(link, j.id)}
                          className="row-action-btn"
                        >
                          {copiedId === j.id ? (
                            <><Check size={12} color="#00ffcc" /> Copiado</>
                          ) : (
                            <><Copy size={12} /> Copiar Enlace</>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
