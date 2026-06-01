import React, { useState, useEffect } from "react";

function Header({ onOpenCollaborators, onOpenHistory }) {
  const [date, setDate] = useState(new Date());

  // Petite fonction bonus pour afficher l'heure en direct dans l'atelier/bureau
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="app-header">
      {/* Élément Droite : Boutons et Info contextuelle */}
      <div className="header-actions">
        <button
          className="header-btn collaborators-btn"
          onClick={onOpenCollaborators}
          title="Gestion des collaborateurs"
        >
          <span className="btn-icon">👥</span>
          <span className="btn-label">Collaborateurs</span>
        </button>

        <button
          className="header-btn history-btn"
          onClick={onOpenHistory}
          title="Historique"
        >
          <span className="btn-icon">⏱️</span>
          <span className="btn-label">Historique</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
