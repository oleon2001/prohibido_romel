import React, { useEffect, useState } from "react";
import { Volume2, VolumeX, Activity } from "lucide-react";
import "./CouncilVoices.css";

// Predefined voices phrases
export const VOICE_QUOTES = {
  prohibido: {
    text: "¡PROHIBIDO!",
    whisper: "El tribunal ha dictado... ¡Prohibido!",
    style: { color: "#ff3e3e", textShadow: "0 0 10px rgba(255, 62, 62, 0.8)" }
  },
  permitido: {
    text: "Lo permito...",
    whisper: "Por ahora... te concedo la existencia.",
    style: { color: "#d4af37", textShadow: "0 0 10px rgba(212, 175, 55, 0.8)" }
  },
  destruyelos: {
    text: "¡Destrúyelos a todos Romel!",
    whisper: "No dejes rastro de su insignificante entropía.",
    style: { color: "#bf3eff", textShadow: "0 0 10px rgba(191, 62, 255, 0.8)" }
  },
  jajaja: {
    text: "¡JAJAJAJAJAJA!",
    whisper: "Creen que su voluntad importa... ¡JAJAJAJA!",
    style: { color: "#ff007f", textShadow: "0 0 10px rgba(255, 0, 127, 0.8)" }
  },
  sucios_mortales: {
    text: "Sucios mortales...",
    whisper: "Esclavos del espacio-tiempo lineal.",
    style: { color: "#00bfff", textShadow: "0 0 10px rgba(0, 191, 255, 0.8)" }
  },
  dios_sin_rezos: {
    text: "Un dios al que nadie le reza...",
    whisper: "Flotando en la nada absoluta.",
    style: { color: "#a5a5a5", textShadow: "0 0 10px rgba(165, 165, 165, 0.8)" }
  }
};

// Global audio helper using Web Speech API with support for custom pitch/rate overrides
let speechCallbacks = { onStart: () => {}, onEnd: () => {} };

export function registerSpeechListeners(onStart, onEnd) {
  speechCallbacks.onStart = onStart;
  speechCallbacks.onEnd = onEnd;
}

export function speakText(text, preset = "creepy", customPitch = null, customRate = null) {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    return;
  }

  // Cancel current speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";

  // Select a Spanish voice
  const voices = window.speechSynthesis.getVoices();
  const spanishVoice = voices.find((v) => v.lang.startsWith("es"));
  if (spanishVoice) {
    utterance.voice = spanishVoice;
  }

  // Apply pitch & rate logic
  if (customPitch !== null && customRate !== null) {
    utterance.pitch = parseFloat(customPitch);
    utterance.rate = parseFloat(customRate);
  } else {
    // Preset fallbacks
    if (preset === "creepy") {
      utterance.pitch = 0.45;
      utterance.rate = 0.8;
    } else if (preset === "insane") {
      utterance.pitch = 1.6;
      utterance.rate = 1.35;
    } else if (preset === "robot") {
      utterance.pitch = 1.0;
      utterance.rate = 0.95;
    } else {
      utterance.pitch = 0.85;
      utterance.rate = 1.0;
    }
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

  // Hook speech events to trigger visual oscilógrafo
  useEffect(() => {
    registerSpeechListeners(
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  }, []);

  // Trigger speech when triggerQuote is set
  useEffect(() => {
    if (triggerQuote && !muted) {
      const quoteInfo = VOICE_QUOTES[triggerQuote];
      if (quoteInfo) {
        let preset = "creepy";
        if (triggerQuote === "jajaja" || triggerQuote === "destruyelos") preset = "insane";
        if (triggerQuote === "sucios_mortales") preset = "robot";

        speakText(quoteInfo.text, preset);

        const newWhisper = {
          id: Date.now(),
          text: quoteInfo.text,
          whisper: quoteInfo.whisper,
          style: quoteInfo.style,
          x: Math.random() * 60 + 20,
          y: Math.random() * 60 + 20,
        };

        setWhispers((prev) => [newWhisper, ...prev].slice(0, 5));

        setTimeout(() => {
          setWhispers((prev) => prev.filter((w) => w.id !== newWhisper.id));
        }, 4000);
      }
    }
  }, [triggerQuote, muted]);

  // Ambient whispers
  useEffect(() => {
    if (!autoWhisper || muted) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const keys = Object.keys(VOICE_QUOTES);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const quoteInfo = VOICE_QUOTES[randomKey];

        const newWhisper = {
          id: Date.now(),
          text: quoteInfo.text,
          whisper: quoteInfo.whisper,
          style: { ...quoteInfo.style, opacity: 0.65 },
          x: Math.random() * 70 + 15,
          y: Math.random() * 70 + 15,
        };

        setWhispers((prev) => [newWhisper, ...prev].slice(0, 4));

        speakText(quoteInfo.text, "robot");

        setTimeout(() => {
          setWhispers((prev) => prev.filter((w) => w.id !== newWhisper.id));
        }, 3500);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [autoWhisper, muted]);

  return (
    <div className="council-voices-hud">
      {/* Visual audio wave visualizer */}
      <div className={`voice-visualizer ${isSpeaking ? "active" : ""}`}>
        <Activity size={16} className="wave-icon" />
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
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        <span>{muted ? "MORTALES MUDOS" : "EL CONSEJO HABLA"}</span>
      </button>

      {/* Pop-up whispers overlays */}
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
