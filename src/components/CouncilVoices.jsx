import React, { useEffect, useState } from "react";
import { Volume2, VolumeX, Activity } from "lucide-react";
import "./CouncilVoices.css";

export const VOICE_QUOTES = {
  prohibido: {
    text: "Prohibido.",
    whisper: "El tribunal ha dictado la sentencia final. Prohibido.",
    style: { color: "#c93b3b", textShadow: "0 0 10px rgba(201, 59, 59, 0.6)", fontFamily: "'Cinzel', serif" }
  },
  permitido: {
    text: "Permitido.",
    whisper: "Se autoriza la existencia temporal en la materia.",
    style: { color: "#ffd700", textShadow: "0 0 10px rgba(255, 215, 0, 0.6)", fontFamily: "'Cinzel', serif" }
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
    text: "Un dios al que nadie reza.",
    whisper: "Silencio absoluto en el templo de Virgo.",
    style: { color: "#9da5b4", textShadow: "0 0 10px rgba(157, 165, 180, 0.6)" }
  },
  delta_dirac: {
    text: "δ(0) = ∞ !",
    whisper: "La singularidad de Dirac consume tu existencia cuántica...",
    style: { color: "#ffb347", textShadow: "0 0 18px rgba(255, 179, 71, 0.9)" }
  },
  cosmos_explosion: {
    text: "EXPLOSIÓN DE COSMOS!",
    whisper: "Tu séptimo sentido es polvo cósmico ante Romel...",
    style: { color: "#ffd700", textShadow: "0 0 22px rgba(255, 215, 0, 0.95)" }
  },
  shaka_whisper: {
    text: "Om...",
    whisper: "El tesoro del cielo juzga tu alma desde el Lost Canvas...",
    style: { color: "#b886ff", textShadow: "0 0 14px rgba(184, 134, 255, 0.8)" }
  },
  madara_despierta: {
    text: "DESPIERTA... A LA REALIDAD.",
    whisper: "Solo la ilusión puede ser perfecta. Este mundo es un infierno.",
    style: { color: "#cc0000", textShadow: "0 0 20px rgba(204, 0, 0, 0.9)", fontFamily: "'Cinzel', serif" }
  },
  tsukuyomi: {
    text: "TSUKUYOMI INFINITO!",
    whisper: "Todo mortal quedará atrapado en el sueño eterno de Madara.",
    style: { color: "#8b0000", textShadow: "0 0 25px rgba(139, 0, 0, 0.95)", fontFamily: "'Cinzel', serif" }
  },
  schizo_risa: {
    text: "JAJAJAJAJA!",
    whisper: "Las voces me dicen que tu entropía es ridículamente baja...",
    style: { color: "#ff6b9d", textShadow: "0 0 15px rgba(255, 107, 157, 0.8)" }
  },
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

  if (customPitch !== null && customRate !== null) {
    utterance.pitch = parseFloat(customPitch);
    utterance.rate = parseFloat(customRate);
  } else {
    utterance.pitch = 0.38;
    utterance.rate = 0.82;
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
          x: Math.random() * 85 + 5,
          y: Math.random() * 80 + 5,
          rotate: (Math.random() - 0.5) * 30,
          scale: Math.random() * 0.5 + 0.7,
        };

        setWhispers((prev) => [newWhisper, ...prev].slice(0, 8));

        setTimeout(() => {
          setWhispers((prev) => prev.filter((w) => w.id !== newWhisper.id));
        }, 3500);
      }
    }
  }, [triggerQuote, muted]);

  useEffect(() => {
    if (!autoWhisper || muted) return;

    const scheduleNext = () => {
      const delay = Math.random() * 8000 + 7000;
      return setTimeout(() => {
        const burst = Math.random() > 0.75 ? 2 : 1;

        const createWhisper = () => {
          const keys = Object.keys(VOICE_QUOTES);
          const randomKey = keys[Math.floor(Math.random() * keys.length)];
          const quoteInfo = VOICE_QUOTES[randomKey];

          const newWhisper = {
            id: Date.now() + Math.random(),
            text: quoteInfo.text,
            whisper: quoteInfo.whisper,
            style: { ...quoteInfo.style, opacity: 0.7 },
            x: Math.random() * 85 + 5,
            y: Math.random() * 80 + 5,
            rotate: (Math.random() - 0.5) * 40,
            scale: Math.random() * 0.6 + 0.6,
          };

          setWhispers((prev) => [newWhisper, ...prev].slice(0, 5));

          if (Math.random() > 0.5) {
            speakText(quoteInfo.text, "grave");
          }

          setTimeout(() => {
            setWhispers((prev) => prev.filter((w) => w.id !== newWhisper.id));
          }, 3500);
        };

        createWhisper();
        if (burst === 2) {
          setTimeout(createWhisper, Math.random() * 500 + 200);
        }

        scheduleNext();
      }, delay);
    };

    const timer = scheduleNext();
    return () => clearTimeout(timer);
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
          <span className="wave-bar bar-6"></span>
          <span className="wave-bar bar-7"></span>
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
        {whispers.map((w, idx) => {
          const chaosClass = idx % 3 === 0 ? "chaos-a" : idx % 3 === 1 ? "chaos-b" : "chaos-c";
          return (
            <div
              key={w.id}
              className={`whisper-bubble ${chaosClass}`}
              style={{
                left: `${w.x}%`,
                top: `${w.y}%`,
                ...w.style,
                animationDelay: `${idx * 0.03}s`,
              }}
            >
              <div className="whisper-title">{w.text}</div>
              <div className="whisper-sub">"{w.whisper}"</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
