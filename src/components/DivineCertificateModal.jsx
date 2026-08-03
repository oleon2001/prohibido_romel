import React, { useRef } from "react";
import { Award, Download, X, ShieldCheck } from "lucide-react";
import { toPng } from "html-to-image";
import { playCosmicChime } from "../services/audioSynth";
import "./DivineCertificateModal.css";

export default function DivineCertificateModal({ judgment, onClose }) {
  const certRef = useRef(null);

  if (!judgment) return null;

  const handleDownloadCert = async () => {
    if (!certRef.current) return;
    playCosmicChime();
    try {
      const dataUrl = await toPng(certRef.current, { quality: 0.95 });
      const link = document.createElement("a");
      link.download = `salvoconducto_${judgment.name.toLowerCase().replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download certificate:", err);
    }
  };

  return (
    <div className="cert-modal-overlay">
      <div className="cert-modal-box">
        <button className="cert-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="cert-document" ref={certRef}>
          <div className="cert-border-outer">
            <div className="cert-border-inner">
              <div className="cert-header">
                <Award size={36} className="cert-seal-icon" />
                <h2 className="cert-title">SALVOCONDUCTO BARIÓNICO DIVINO</h2>
                <span className="cert-subtitle">TRIBUNAL DE REGLAMENTACIÓN MENTAL DE ROMEL</span>
              </div>

              <div className="cert-body">
                <p className="cert-text">
                  Por la presente bula cósmica, se certifica que el mortal:
                </p>
                <h1 className="cert-mortal-name">{judgment.name.toUpperCase()}</h1>
                <p className="cert-text">
                  Ha sido inspeccionado y su matriz molecular ha sido declarada como:
                </p>
                <div className="cert-status-tag">
                  <ShieldCheck size={18} /> PERMITIDO PARA TRANSITAR EL UNIVERSO
                </div>
                <p className="cert-small-print">
                  Entropía Nominal: <strong>{judgment.entropy || 0} S/k</strong> | Nivel F: <strong>F{judgment.fCategory || 1}</strong> | Fecha: <strong>{new Date().toLocaleDateString()}</strong>
                </p>
              </div>

              <div className="cert-footer">
                <div className="cert-signature">
                  <span className="sig-line">_______________________</span>
                  <span className="sig-name">Romel (El Creador)</span>
                </div>
                <div className="cert-signature">
                  <span className="sig-line">_______________________</span>
                  <span className="sig-name">Virgo Shaka (Sello Divino)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cert-actions">
          <button className="cert-download-btn" onClick={handleDownloadCert}>
            <Download size={16} />
            <span>DESCARGAR DIPLOMA HD</span>
          </button>
        </div>
      </div>
    </div>
  );
}
