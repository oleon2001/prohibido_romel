import React, { useEffect, useState } from "react";
import { Volume2, VolumeX, Activity } from "lucide-react";
import "./CouncilVoices.css";

// Predefined voices phrases - Solemn & Authoritative Tribunal Tone
export const VOICE_QUOTES = {
  prohibido: {
    text: "Prohibido.",
    whisper: "El tribunal ha dictado la sentencia final. Prohibido.",
    style: { color: "#c93b3b", textShadow: "0 0 10px rgba(201, 59, 59, 0.6)", fontFamily: "'Cinzel', serif" }
  },
  permitido: {
    text: "Permitido.",
    whisper: "Se autoriza la existencia temporal en la materia.",
    style: { color: "#d8b878", textShadow: "0 0 10px rgba(216, 184, 120, 0.6)", fontFamily: "'Cinzel', serif" }
  },
  destruyelos: {
    text: "Destrúyelos a todos, Romel.",
    whisper: "Sin vacilación ni remordimiento ante la entropía.",
    style: { color: "#a878d8", textShadow: "0 0 10px rgba(168, 120, 216, 0.6)" }
  },
  jajaja: {
    text: "Insignificantes mortales.",
    whisper: "Creen dominar el espacio-tiempo...",
    style: { color: "#d87895", textShadow: "0 0 10px rgba(216, 120, 149, 0.6)" }
  },
  sucios_mortales: {
    text: "Mortales de baja entropía.",
    whisper: "Su voluntad es polvo en el cosmos.",
    style: { color: "#4a9ebb", textShadow: "0 0 10px rgba(74, 158, 187, 0.6)" }
  },
  dios_sin_rezos: {
    text: "Un dios al que nadie rige.",
    whisper: "Silencio absoluto en el templo de Virgo.",
    style: { color: "#9da5b4", textShadow: "0 0 10px rgba(157, 165, 180, 0.6)" }
  }
};

let speechCallbacks = { onStart: () => {}, onEnd: () => {} };

export function registerSpeechListeners(onStart, onEnd) {
  speechCallbacks.onStart = onStart;
  speechCallbacks.onEnd = onEnd;
}

export function speakText(text, preset = "grave", customPitch = null, customRate = null) {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";

  const voices = window.speechSynthesis.getVoices();
  const spanishVoice = voices.find((v) => v.lang.startsWith("es"));
  if (spanishVoice) {
    utterance.voice = spanishVoice;
  }

  // Serious, grave, solemn default parameters
  if (customPitch !== null && customRate !== null) {
    utterance.pitch = parseFloat(customPitch);
    utterance.rate = parseFloat(customRate);
  } else {
    // Serious presets
    utterance.pitch = 0.38; // Low grave tone
    utterance.rate = 0.82;  // Slow authoritative pace
  }

  utterance.onstart = () => {
    speechCallbacks.onStart();
  };
  utterance.onend = () => {
    speechCallbacks.onEnd();
  };
  utterance.onerror = () => {
    speechCallbacks.onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export default function CouncilVoices({ triggerQuote, autoWhisper = true }) {
  const [muted, setMuted] = useState(false);
  const [whispers, setWhispers] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    registerSpeechListeners(
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  }, []);

  useEffect(() => {
    if (triggerQuote && !muted) {
      const quoteInfo = VOICE_QUOTES[triggerQuote];
      if (quoteInfo) {
        speakText(quoteInfo.text, "grave");

        const newWhisper = {
          id: Date.now(),
          text: quoteInfo.text,
          whisper: quoteInfo.whisper,
          style: quoteInfo.style,
          x: Math.random() * 50 + 25,
          y: Math.random() * 50 + 25,
        };

        setWhispers((prev) => [newWhisper, ...prev].slice(0, 4));

        setTimeout(() => {
          setWhispers((prev) => prev.filter((w) => w.id !== newWhisper.id));
        }, 4500);
      }
    }
  }, [triggerQuote, muted]);

  useEffect(() => {
    if (!autoWhisper || muted) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const keys = Object.keys(VOICE_QUOTES);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const quoteInfo = VOICE_QUOTES[randomKey];

        const newWhisper = {
          id: Date.now(),
          text: quoteInfo.text,
          whisper: quoteInfo.whisper,
          style: { ...quoteInfo.style, opacity: 0.6 },
          x: Math.random() * 60 + 20,
          y: Math.random() * 60 + 20,
        };

        setWhispers((prev) => [newWhisper, ...prev].slice(0, 3));

        speakText(quoteInfo.text, "grave");

        setTimeout(() => {
          setWhispers((prev) => prev.filter((w) => w.id !== newWhisper.id));
        }, 4000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [autoWhisper, muted]);

  return (
    <div className="council-voices-hud">
      <div className={`voice-visualizer ${isSpeaking ? "active" : ""}`}>
        <Activity size={15} className="wave-icon" />
        <div className="waves">
          <span className="wave-bar bar-1"></span>
          <span className="wave-bar bar-2"></span>
          <span className="wave-bar bar-3"></span>
          <span className="wave-bar bar-4"></span>
          <span className="wave-bar bar-5"></span>
        </div>
      </div>

      <button 
        onClick={() => setMuted(!muted)} 
        className={`audio-toggle-btn ${muted ? "muted" : "active"}`}
        title={muted ? "Activar Voces" : "Silenciar Voces"}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        <span>{muted ? "TRIBUNAL SILENCIADO" : "DECRETOS DEL TRIBUNAL"}</span>
      </button>

      <div className="whispers-overlay-container">
        {whispers.map((w) => (
          <div
            key={w.id}
            className="whisper-bubble"
            style={{
              left: `${w.x}%`,
              top: `${w.y}%`,
              ...w.style
            }}
          >
            <div className="whisper-title">{w.text}</div>
            <div className="whisper-sub">"{w.whisper}"</div>
          </div>
        ))}
      </div>
    </div>
  );
}
