import React, { useState, useEffect } from "react";
import { getJudgment, saveJudgment } from "../services/store";
import AstralCard from "../components/AstralCard";
import { speakText, VOICE_QUOTES } from "../components/CouncilVoices";
import { ArrowLeft, Send, Sparkles, AlertTriangle, RefreshCw, Eye } from "lucide-react";
import "./RecipientView.css";

export default function RecipientView({ judgmentId, setView }) {
  const [loading, setLoading] = useState(true);
  const [judgment, setJudgment] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [appealText, setAppealText] = useState("");
  const [submittingAppeal, setSubmittingAppeal] = useState(false);
  const [error, setError] = useState(null);

  // Fetch judgment details
  const fetchDetails = async () => {
    try {
      const data = await getJudgment(judgmentId);
      if (data) {
        setJudgment(data);
        setError(null);
      } else {
        setError("La clave de sentencia no existe en el registro astral.");
      }
    } catch (e) {
      console.error(e);
      setError("Fallo de comunicación en el hiperespacio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [judgmentId]);

  // Real-time polling to update recipient's view if Romel alters their destiny
  useEffect(() => {
    if (!judgmentId) return;
    const interval = setInterval(() => {
      fetchDetails();
    }, 4000);
    return () => clearInterval(interval);
  }, [judgmentId]);

  // Handle entry gate and play transition
  const handleUnlockAndEnter = () => {
    setIsTransitioning(true);
    
    if (judgment) {
      const pitch = judgment.voicePitch !== undefined ? judgment.voicePitch : 0.45;
      const rate = judgment.voiceRate !== undefined ? judgment.voiceRate : 0.8;

      // Introductory sentence + quote using Romel's custom pitch and speed!
      const statusText = judgment.status === "prohibido" ? "PROHIBIDO" : "PERMITIDO";
      
      speakText(`Socio mortal... Has sido decretado como... ${statusText}.`, null, pitch, rate);
      
      // Delay quote speech to coordinate with the opening of Shaka's eyes
      setTimeout(() => {
        speakText(judgment.voiceQuote || "Lo permito...", null, pitch, rate);
      }, 4000);
    }

    // Complete transition and show card after 6 seconds (length of eye opening sequence)
    setTimeout(() => {
      setIsTransitioning(false);
      setUnlocked(true);
    }, 6000);
  };

  // Submit appeal
  const handleAppealSubmit = async (e) => {
    e.preventDefault();
    if (!appealText.trim() || !judgment) return;

    setSubmittingAppeal(true);
    const updated = {
      ...judgment,
      appeal: appealText.trim(),
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

  if (loading) {
    return (
      <div className="recipient-loading">
        <RefreshCw className="spinner" size={48} />
        <p>Invocando registros desde la biblioteca de Lost Canvas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipient-error glass-panel-rec">
        <AlertTriangle size={48} color="#ff3e3e" />
        <h2>SENTENCIA EXTRAVIADA</h2>
        <p>{error}</p>
        <button onClick={() => setView("portal")} className="back-btn-rec">
          <ArrowLeft size={16} /> Volver al Portal
        </button>
      </div>
    );
  }

  // Intermediate transition: Virgo Shaka abriendo los ojos
  if (isTransitioning) {
    return (
      <div className="shaka-eyes-transition">
        <div className="transition-space-grid"></div>
        <div className="shaka-mandala"></div>
        <div className="eyes-svg-wrapper">
          <svg viewBox="0 0 400 150" className="shaka-eyes-svg" xmlns="http://www.w3.org/2000/svg">
            {/* Left Eye */}
            <path d="M 50,75 Q 100,25 150,75 Q 100,125 50,75 Z" className="eye-back" />
            <path d="M 50,75 Q 100,35 150,75" className="eye-lid-upper" />
            <path d="M 50,75 Q 100,115 150,75" className="eye-lid-lower" />
            <circle cx="100" cy="75" r="22" className="eye-pupil" />
            <circle cx="100" cy="75" r="8" className="eye-pupil-core" />
            
            {/* Right Eye */}
            <path d="M 250,75 Q 300,25 350,75 Q 300,125 250,75 Z" className="eye-back" />
            <path d="M 250,75 Q 300,35 350,75" className="eye-lid-upper" />
            <path d="M 250,75 Q 300,115 350,75" className="eye-lid-lower" />
            <circle cx="300" cy="75" r="22" className="eye-pupil" />
            <circle cx="300" cy="75" r="8" className="eye-pupil-core" />
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
          El Creador Romel ha sellado tu destino molecular en la red de kvdb.io.
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

        <AstralCard judgment={judgment} />
      </div>

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
          </div>
        ) : (
          <form onSubmit={handleAppealSubmit} className="appeal-form">
            <p className="appeal-instructions">
              Si crees que tu entropía es incorrecta, viola el principio de incertidumbre de Heisenberg, 
              o deseas apelar con la gracia de Virgo Shaka, escribe tu defensa cuántica:
            </p>
            <textarea
              required
              placeholder="Escribe tu contraargumentación aquí... (ej. Mi entropía local no ha aumentado, he completado mi Lost Canvas...)"
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
