import React, { useState, useEffect } from "react";
import { API_URL } from "./config";

function HistoryMenu({ isOpen, onClose, onViewAll }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost/MECA-CN-gestionStock/api_stock.php?action=get_history",
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();

      if (data.erreur) {
        console.error("Erreur API:", data.erreur);
        setHistory([]);
      } else {
        setHistory(data || []);
      }
    } catch (error) {
      console.error("Erreur fetch historique:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const getActionClass = (action) => {
    switch (action) {
      case "Ajout":
        return "add";
      case "Consommation":
        return "consumption";
      case "Modification":
        return "modify";
      case "Création":
        return "create"
      case "Suppression":
        return "suppr"
      default:
        return "other";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="menu-overlay" onClick={onClose}>
      <div
        className="menu-container history-menu"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="menu-header">
          <h2>Historique des modifications</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="history-header-info">
          <button
            className="view-all-link"
            onClick={() => {
              onClose();
              onViewAll();
            }}
          >
            Voir l'historique complet →
          </button>
        </div>

        {loading ? (
          <p className="loading-history">Chargement...</p>
        ) : history.length === 0 ? (
          <p className="no-history">Aucun historique disponible</p>
        ) : (
          <div className="history-timeline">
            {history.slice(0, 20).map((entry, index) => (
              <div key={index} className="history-entry">
                <div className="history-time">{entry.date}</div>
                <div
                  className={`history-action ${getActionClass(entry.action)}`}
                >
                  <div className="action-title">{entry.action}</div>
                  <div className="action-description">{entry.commentaire}</div>
                  {entry.user && (
                    <div className="action-author">Auteur : {entry.user}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryMenu;
