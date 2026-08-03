import React, { useEffect, useState } from "react";
import "./GlassShatterOverlay.css";

export default function GlassShatterOverlay({ active, onComplete }) {
  const [shards, setShards] = useState([]);

  useEffect(() => {
    if (!active) {
      setShards([]);
      return;
    }

    // Generate random glass shards
    const newShards = Array.from({ length: 24 }).map((_, i) => {
      const angle = (i / 24) * 360 + Math.random() * 15;
      const distance = 150 + Math.random() * 350;
      const rotate = Math.random() * 720 - 360;
      const scale = 0.4 + Math.random() * 0.8;

      return {
        id: i,
        angle,
        distance,
        rotate,
        scale,
        delay: Math.random() * 0.15,
      };
    });

    setShards(newShards);

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2800);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div className="shatter-container">
      <div className="shatter-flash"></div>
      <div className="shatter-shockwave"></div>
      <div className="shatter-text-banner">
        <span className="shatter-sub">SELLO DIVISIONAL ROTO</span>
        <h1 className="shatter-main">¡DESTINO REESCRITO!</h1>
        <span className="shatter-sub-gold">SANTUARIO DE VIRGO SHAKA DESPIERTO</span>
      </div>

      <div className="shards-wrapper">
        {shards.map((shard) => {
          const rad = (shard.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * shard.distance;
          const ty = Math.sin(rad) * shard.distance;

          return (
            <div
              key={shard.id}
              className="glass-shard"
              style={{
                "--tx": `${tx}px`,
                "--ty": `${ty}px`,
                "--rot": `${shard.rotate}deg`,
                "--scale": shard.scale,
                animationDelay: `${shard.delay}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
