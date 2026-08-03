import React, { useState, useEffect } from "react";
import { getAllLocalJudgments } from "../services/store";
import { Sparkles, Eye, ShieldCheck, Ban, ArrowRight, Search } from "lucide-react";
import { playCosmicChime } from "../services/audioSynth";
import "./AstralWall.css";

export default function AstralWall({ onSelectJudgment }) {
  const [judgments, setJudgments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadWallData() {
      try {
        const data = await getAllLocalJudgments();
        if (mounted) {
          setJudgments(data);
        }
      } catch (err) {
        console.error("Failed to load Astral Wall data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadWallData();
    const interval = setInterval(loadWallData, 4000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const filtered = judgments.filter((j) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "prohibido" && j.status === "prohibido") ||
      (filter === "permitido" && j.status === "permitido");

    const matchesSearch =
      !searchQuery.trim() ||
      j.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="astral-wall-container">
      <div className="astral-wall-header">
        <div>
          <h2 className="astral-wall-title">
            <Sparkles className="inline-sparkle" size={22} /> EL MURO ASTRAL DEL LOST CANVAS
          </h2>
          <p className="astral-wall-subtitle">
            Registro eterno de las almas juzgadas por el Tribunal Supremo de Romel.
          </p>
        </div>

        <div className="astral-controls">
          <div className="astral-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por alma o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="astral-search-input"
            />
          </div>

          <div className="astral-filters">
            <button
              className={`astral-filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => { playCosmicChime(); setFilter("all"); }}
            >
              TODOS ({judgments.length})
            </button>
            <button
              className={`astral-filter-btn prohibido ${filter === "prohibido" ? "active" : ""}`}
              onClick={() => { playCosmicChime(); setFilter("prohibido"); }}
            >
              PROHIBIDOS
            </button>
            <button
              className={`astral-filter-btn permitido ${filter === "permitido" ? "active" : ""}`}
              onClick={() => { playCosmicChime(); setFilter("permitido"); }}
            >
              PERMITIDOS
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="astral-loading">Cargando constelaciones del éter...</div>
      ) : filtered.length === 0 ? (
        <div className="astral-empty">No hay sentencias grabadas en este sector del firmamento.</div>
      ) : (
        <div className="astral-grid">
          {filtered.map((j) => (
            <div
              key={j.id}
              className={`astral-node-card ${j.status}`}
              onClick={() => { playCosmicChime(); if (onSelectJudgment) onSelectJudgment(j.id); }}
            >
              <div className="node-glow"></div>
              <div className="node-top">
                <span className="node-id">#{j.id.substring(0, 6)}</span>
                <span className={`node-badge ${j.status}`}>
                  {j.status === "prohibido" ? <Ban size={12} /> : <ShieldCheck size={12} />}
                  {j.status.toUpperCase()}
                </span>
              </div>

              <div className="node-subject">{j.name}</div>

              <div className="node-details">
                <span>Entropía: {j.entropy}</span>
                <span>Nivel F{j.fCategory || 1}</span>
              </div>

              {j.seen && (
                <div className="node-telemetry">
                  <Eye size={11} /> Visto ({j.viewCount || 1}x)
                </div>
              )}

              <div className="node-hover-action">
                <span>INSPECTAR SENTENCIA</span>
                <ArrowRight size={12} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
