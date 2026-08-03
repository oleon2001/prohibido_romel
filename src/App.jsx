import React, { useState, useEffect } from "react";
import MathBackground from "./components/MathBackground";
import CouncilVoices from "./components/CouncilVoices";
import MainPortal from "./views/MainPortal";
import RomelAdmin from "./views/RomelAdmin";
import RecipientView from "./views/RecipientView";
import "./App.css";

export default function App() {
  const [view, setViewState] = useState("portal"); // portal, admin, recipient
  const [judgmentId, setJudgmentIdState] = useState("");
  const [triggerQuote, setTriggerQuote] = useState("");

  // Sync state changes to browser URL query parameters
  // This allows copy-pasting links in Vite SPAs without 404 Vercel router errors.
  const setView = (newView) => {
    setViewState(newView);
    const url = new URL(window.location.href);
    url.searchParams.delete("id");
    
    if (newView === "admin") {
      url.searchParams.set("view", "admin");
    } else {
      url.searchParams.delete("view");
    }
    
    window.history.pushState({}, "", url.toString());
  };

  const setJudgmentId = (id) => {
    setJudgmentIdState(id);
    setViewState("recipient");
    const url = new URL(window.location.href);
    url.searchParams.delete("view");
    url.searchParams.set("id", id);
    window.history.pushState({}, "", url.toString());
  };

  // Listen to browser URL changes (popstate)
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      const viewParam = params.get("view");

      if (id) {
        setJudgmentIdState(id);
        setViewState("recipient");
      } else if (viewParam === "admin") {
        setViewState("admin");
      } else {
        setViewState("portal");
      }
    };

    // Initial check
    handleUrlChange();

    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, []);

  // Helper to trigger voice + whisper bubble
  const triggerCouncilVoice = (quoteKey) => {
    setTriggerQuote(quoteKey);
    // Clear trigger after a short delay so it can be re-triggered
    setTimeout(() => setTriggerQuote(""), 100);
  };

  return (
    <div className="app-root">
      {/* 🌌 Animated Physical-Mental Background */}
      <MathBackground />

      {/* 🔊 Schizophrenic Council Whispers (TTS + Text Pop-ups) */}
      <CouncilVoices triggerQuote={triggerQuote} autoWhisper={true} />

      {/* 🧭 Dynamic Route Views */}
      <main className="app-main-content">
        {view === "portal" && (
          <MainPortal 
            setView={setView} 
            setJudgmentId={setJudgmentId} 
          />
        )}

        {view === "admin" && (
          <RomelAdmin 
            setView={setView} 
            triggerVoice={triggerCouncilVoice} 
          />
        )}

        {view === "recipient" && (
          <RecipientView 
            judgmentId={judgmentId} 
            setView={setView} 
          />
        )}
      </main>
    </div>
  );
}
