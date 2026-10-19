import React, { useState, useEffect } from "react";
import { getAllLocalJudgments } from "../services/store";
import { Sparkles, Eye, ShieldCheck, Ban, ArrowRight, Search, Orbit } from "lucide-react";
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

  const prohibidosCount = judgments.filter((j) => j.status === "prohibido").length;
  const permitidosCount = judgments.filter((j) => j.status === "permitido").length;

  return (
    <section className="astral-wall-container">
      <div className="astral-wall-header">
        <div className="astral-header-title-block">
          <div className="astral-eyebrow">REGISTRO ETERNO · SANTUARIO DE VIRGO</div>
          <h2 className="astral-wall-title">
            <Sparkles className="inline-sparkle" size={20} /> EL MURO ASTRAL DEL LOST CANVAS
          </h2>
          <p className="astral-wall-subtitle">
            Constelación de las almas juzgadas por el Tribunal Supremo de Romel.
          </p>
        </div>

        <div className="astral-controls">
          <div className="astral-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar alma o ID..."
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
              PROHIBIDOS ({prohibidosCount})
            </button>
            <button
              className={`astral-filter-btn permitido ${filter === "permitido" ? "active" : ""}`}
              onClick={() => { playCosmicChime(); setFilter("permitido"); }}
            >
              PERMITIDOS ({permitidosCount})
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="astral-loading">
          <Orbit size={24} className="inline-sparkle" />
          <span>Sincronizando constelaciones del éter...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="astral-empty">
          No hay sentencias grabadas en este sector del firmamento.
        </div>
      ) : (
        <div className="astral-grid">
          {filtered.map((j) => {
            const stars = Math.min(5, Math.max(1, j.fCategory || 1));
            const entropyPct = Math.min(100, Math.max(6, Math.round(((j.entropy || 0) / 9999) * 100)));
            return (
              <div
                key={j.id}
                className={`astral-node-card ${j.status}`}
                onClick={() => { playCosmicChime(); if (onSelectJudgment) onSelectJudgment(j.id); }}
              >
                <div className="node-ambient-glow"></div>

                <div className="node-top">
                  <span className="node-id">#{j.id.substring(0, 6)}</span>
                  <span className={`node-badge ${j.status}`}>
                    {j.status === "prohibido" ? <Ban size={11} /> : <ShieldCheck size={11} />}
                    {j.status.toUpperCase()}
                  </span>
                </div>

                <div className="node-subject">{j.name}</div>

                <div className="node-stars-row">
                  <div className="node-stars">
                    {Array.from({ length: stars }).map((_, i) => (
                      <Orbit key={i} size={11} className="node-star-icon" />
                    ))}
                  </div>
                  <span className="node-f-tag">NIVEL F{stars}</span>
                </div>

                <div className="node-entropy-bar-wrap">
                  <div className="node-details">
                    <span>ENTROPÍA: {j.entropy} S/k</span>
                    <span>NV: {j.divineWill || (j.status === "prohibido" ? "0" : "∞")}</span>
                  </div>
                  <div className="node-entropy-track">
                    <div
                      className={`node-entropy-fill ${j.status}`}
                      style={{ width: `${entropyPct}%` }}
                    />
                  </div>
                </div>

                <div className="node-footer-row">
                  {j.seen ? (
                    <span className="node-telemetry seen">
                      <Eye size={11} /> Visto ({j.viewCount || 1}x)
                    </span>
                  ) : (
                    <span className="node-telemetry pending">
                      ⏳ Sellado
                    </span>
                  )}

                  <span className="node-hover-action">
                    <span>ABRIR</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
