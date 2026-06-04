import React, { useState, useEffect } from "react";

function Header({ onOpenCollaborators, onOpenHistory }) {
  const [date, setDate] = useState(new Date());

  // Fonction bonus pour ajouter l'heure en direct sur le bureau (cette fonctionnalité n'est plus sur le site en lui-même, mais la fonction a été laissée au cas où un retard de cette dernière est prévu)
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="app-header">
      {/* Élément Droite : Boutons et Infos contextuelle */}
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
