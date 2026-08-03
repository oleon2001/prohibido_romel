import React, { useState, useEffect, useRef, useCallback } from "react";
import { getJudgment, saveJudgment, markJudgmentAsSeen } from "../services/store";
import MentalCard from "../components/MentalCard";
import GlassShatterOverlay from "../components/GlassShatterOverlay";
import DivineCertificateModal from "../components/DivineCertificateModal";
import { speakText } from "../components/CouncilVoices";
import { ArrowLeft, Send, Sparkles, AlertTriangle, RefreshCw, Eye, Share, Shield, Zap, Flame, Award } from "lucide-react";
import "./RecipientView.css";

export default function RecipientView({ judgmentId, fallbackEncoded, setView }) {
  const [loading, setLoading] = useState(true);
  const [judgment, setJudgment] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [appealText, setAppealText] = useState("");
  const [appealStance, setAppealStance] = useState("plegaria");
  const [submittingAppeal, setSubmittingAppeal] = useState(false);
  const [shatterActive, setShatterActive] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [error, setError] = useState(null);

  const prevStatusRef = useRef(null);

  // Fetch judgment details
  const fetchDetails = useCallback(async () => {
    try {
      const data = await getJudgment(judgmentId, fallbackEncoded);
      if (data) {
        // Detect real-time transformation from Prohibido to Permitido!
        if (prevStatusRef.current === "prohibido" && data.status === "permitido") {
          setShatterActive(true);
          speakText("¡El sello divino ha sido roto! El Creador Romel ha reescrito tu destino a PERMITIDO.", null, data.voicePitch || 1, data.voiceRate || 1);
        }

        prevStatusRef.current = data.status;
        setJudgment(data);
        setError(null);
      } else {
        setError("La clave de sentencia no existe en el registro mental.");
      }
    } catch (e) {
      console.error(e);
      setError("Fallo de comunicación en el hiperespacio.");
    } finally {
      setLoading(false);
    }
  }, [judgmentId, fallbackEncoded]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Real-time polling to update recipient's view if Romel alters their destiny
  useEffect(() => {
    if (!judgmentId) return;
    const interval = setInterval(() => {
      fetchDetails();
    }, 4000);
    return () => clearInterval(interval);
  }, [judgmentId, fetchDetails]);

  // Handle entry gate, send telemetry, and play transition
  const handleUnlockAndEnter = async () => {
    setIsTransitioning(true);

    // Register telemetría de lectura (seen status)
    markJudgmentAsSeen(judgmentId);
    
    if (judgment) {
      const pitch = judgment.voicePitch !== undefined ? judgment.voicePitch : 0.45;
      const rate = judgment.voiceRate !== undefined ? judgment.voiceRate : 0.8;

      const statusText = judgment.status === "prohibido" ? "PROHIBIDO" : "PERMITIDO";
      
      speakText(`Socio mortal... Has sido decretado como... ${statusText}.`, null, pitch, rate);
      
      setTimeout(() => {
        speakText(judgment.voiceQuote || "Lo permito...", null, pitch, rate);
      }, 4000);
    }

    setTimeout(() => {
      setIsTransitioning(false);
      setUnlocked(true);
    }, 6000);
  };

  // Preset appeal stances
  const applyPresetStance = (stanceKey, presetText) => {
    setAppealStance(stanceKey);
    setAppealText(presetText);
  };

  // Submit appeal
  const handleAppealSubmit = async (e) => {
    e.preventDefault();
    if (!appealText.trim() || !judgment) return;

    setSubmittingAppeal(true);
    const updated = {
      ...judgment,
      appeal: appealText.trim(),
      appealStance,
      appealSubmitted: true,
    };

    try {
      await saveJudgment(updated);
      setJudgment(updated);
      speakText("Tu contraargumentación ha sido enviada al Creador Romel.", null, judgment.voicePitch, judgment.voiceRate);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAppeal(false);
    }
  };

  const shareAppealWhatsApp = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${judgmentId}`;
    const msg = encodeURIComponent(`📜 MI SENTENCIA MENTAL 📜\n\n⚡ ${judgment.name}\nSentencia: ${judgment.status.toUpperCase()}\nF: ${judgment.fCategory || 1}\n\nApelación:\n"${judgment.appeal}"\n\nLink: ${shareUrl}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  if (loading) {
    return (
      <div className="loading-screen text-center">
        <RefreshCw size={36} className="spin-icon text-gold" />
        <p className="loading-text">Decodificando vector de entropía en el éter...</p>
      </div>
    );
  }

  if (error || !judgment) {
    return (
      <div className="error-screen text-center">
        <AlertTriangle size={48} className="text-red" />
        <h2 className="error-title">SENTENCIA EXTRAVIADA</h2>
        <p className="error-desc">{error || "El registro mental ha expirado o no existe."}</p>
        <button onClick={() => setView("portal")} className="btn-primary">
          <ArrowLeft size={16} /> Regresar al Plano Ordinario
        </button>
      </div>
    );
  }

  // Eye Transition Overlay: Virgo Shaka abriendo los ojos con estallido divino
  if (isTransitioning) {
    return (
      <div className="shaka-eyes-transition">
        <div className="transition-space-grid"></div>
        <div className="shaka-mandala"></div>
        <div className="eyes-svg-wrapper">
          <svg viewBox="0 0 400 150" className="shaka-eyes-svg" xmlns="http://www.w3.org/2000/svg">
            <g>
              {/* Left Eye */}
              <path d="M 50,75 Q 100,25 150,75 Q 100,125 50,75 Z" className="eye-back" />
              <path d="M 50,75 Q 100,35 150,75" className="eye-lid-upper" />
              <path d="M 50,75 Q 100,115 150,75" className="eye-lid-lower" />
              <circle cx="100" cy="75" r="22" className="eye-pupil" />
              <circle cx="100" cy="75" r="8" className="eye-pupil-core" />
            </g>
            <g>
              {/* Right Eye */}
              <path d="M 250,75 Q 300,25 350,75 Q 300,125 250,75 Z" className="eye-back" />
              <path d="M 250,75 Q 300,35 350,75" className="eye-lid-upper" />
              <path d="M 250,75 Q 300,115 350,75" className="eye-lid-lower" />
              <circle cx="300" cy="75" r="22" className="eye-pupil" />
              <circle cx="300" cy="75" r="8" className="eye-pupil-core" />
            </g>
          </svg>
        </div>
        <div className="shaka-speech-text">
          "El tesoro del cielo... se manifiesta."
        </div>
        <div className="whiteout-flash"></div>
      </div>
    );
  }

  // Pre-state: Gate to unlock audio context
  if (!unlocked) {
    return (
      <div className="gate-screen text-center">
        <div className="gate-glow-glyph">
          <Eye size={64} className="glyph-eye" />
        </div>
        <h2 className="gate-title">DECRETO DIVINO PENDIENTE</h2>
        <p className="gate-desc">
          El Creador Romel ha sellado tu destino molecular en la nube cuántica.
          Prepárate para cruzar el Lost Canvas de Virgo Shaka y escuchar las voces del consejo.
        </p>
        <button onClick={handleUnlockAndEnter} className="gate-unlock-btn">
          <Sparkles size={18} /> ABRIR PORTAL DE DESTINO
        </button>
        <button onClick={() => setView("portal")} className="gate-back-link">
          Escapar al Plano Ordinario
        </button>
      </div>
    );
  }

  return (
    <div className="recipient-container">
      {/* Real-time Glass Shatter transformation overlay */}
      <GlassShatterOverlay active={shatterActive} onComplete={() => setShatterActive(false)} />

      {/* Back button */}
      <button onClick={() => setView("portal")} className="back-btn-rec-top">
        <ArrowLeft size={16} /> Salir del Portal
      </button>

      {/* Main cosmic card display */}
      <div className="card-presentation-box">
        <div className="judgment-status-banner">
          {judgment.status === "prohibido" ? (
            <h2 className="banner-txt prohibited">¡HAS SIDO PROHIBIDO!</h2>
          ) : (
            <h2 className="banner-txt permitted">HAS SIDO LO PERMITIDO</h2>
          )}
        </div>

        <MentalCard judgment={judgment} />

        {judgment.status === "permitido" && (
          <button onClick={() => setShowCertModal(true)} className="view-cert-btn">
            <Award size={16} /> VER SALVOCONDUCTO DIVINO DE REDENCIÓN
          </button>
        )}

        <button onClick={shareAppealWhatsApp} className="share-whatsapp-card-btn">
          <Share size={16} /> Compartir Sentencia por WhatsApp
        </button>
      </div>

      {showCertModal && (
        <DivineCertificateModal
          judgment={judgment}
          onClose={() => setShowCertModal(false)}
        />
      )}

      {/* Appeal Form Section */}
      <div className="appeal-form-container glass-panel-rec">
        <h3 className="appeal-title">
          {judgment.appealSubmitted
            ? "Tu Contraargumentación está en el Éter"
            : "¿Deseas Contraargumentar ante el Creador?"}
        </h3>

        {judgment.appealSubmitted ? (
          <div className="appeal-submitted-display">
            <p className="submitted-text">
              <strong>Descargo Presentado:</strong> "{judgment.appeal}"
            </p>
            <div className="waiting-indicator">
              <span className="pulse-dot"></span>
              <span>Esperando que el Creador Romel reevalúe tu destino en vivo...</span>
            </div>
            <button onClick={shareAppealWhatsApp} className="send-appeal-btn" style={{ marginTop: '12px', background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}>
              <Share size={16} /> Compartir por WhatsApp
            </button>
          </div>
        ) : (
          <form onSubmit={handleAppealSubmit} className="appeal-form">
            <p className="appeal-instructions">
              Si crees que tu entropía es incorrecta o deseas apelar ante Virgo Shaka, elige una postura cuántica o escribe tu defensa:
            </p>

            <div className="stance-selector-group">
              <button
                type="button"
                className={`stance-btn ${appealStance === "plegaria" ? "active" : ""}`}
                onClick={() => applyPresetStance("plegaria", "Oh Creador Romel, apelo a la clemencia de Virgo Shaka. He purificado mi cosmos.")}
              >
                <Shield size={13} /> Plegaria a Shaka
              </button>
              <button
                type="button"
                className={`stance-btn ${appealStance === "heisenberg" ? "active" : ""}`}
                onClick={() => applyPresetStance("heisenberg", "Invoco el Principio de Incertidumbre: mi entropía local es indeterminada.")}
              >
                <Zap size={13} /> Incertidumbre Heisenberg
              </button>
              <button
                type="button"
                className={`stance-btn ${appealStance === "schrodinger" ? "active" : ""}`}
                onClick={() => applyPresetStance("schrodinger", "Paradoja de Schrödinger: estoy simultáneamente Prohibido y Permitido.")}
              >
                <Flame size={13} /> Paradoja Schrödinger
              </button>
            </div>

            <textarea
              required
              placeholder="Escribe tu contraargumentación aquí..."
              value={appealText}
              onChange={(e) => setAppealText(e.target.value)}
              className="appeal-textarea"
              maxLength={280}
            />
            <button
              type="submit"
              disabled={submittingAppeal || !appealText.trim()}
              className="send-appeal-btn"
            >
              {submittingAppeal ? (
                "Transmitiendo..."
              ) : (
                <>
                  <Send size={16} /> Transmitir Descargo en el Tejido
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
