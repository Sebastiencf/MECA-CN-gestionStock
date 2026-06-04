import React, { useState, useEffect } from "react";
import MatiereRow from "./MatiereRow";
import { API_URL } from "./config";

function Dashboard({ onNavigate }) {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connexion l'API PHP locale développée sur Wamp
    fetch("http://localhost/MECA-CN-gestionStock/api_stock.php")
      .then((res) => res.json())
      .then((data) => {
        setMatieres(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setLoading(false);
      });
  }, []);

  const handleEdit = (matiere) => {
    // Passer les données de la matière et naviguer vers la page de modification
    onNavigate && onNavigate("modify", matiere);
  };

  if (loading)
    return <div className="loading">Chargement de l'inventaire...</div>;

  return (
    <main className="dashboard-main">
      {/* Header interne du Dashboard */}
      <div className="dashboard-header">
        <div>
          <h2 className="main-title">Matières disponibles</h2>
          <p className="main-subtitle">Inventaire en temps réel</p>
        </div>

        {/* Barre de recherche */}
        <div className="search-container">
          <span className="search-icon"><img src="/icons/loupe_light.png" alt="Barre dde recherche" className="loupe-icon"/></span>
          <input
            type="text"
            placeholder="Rechercher une matière..."
            className="search-input"
          />
        </div>
      </div>

      {/* En-têtes de colonnes de la liste */}
      <div className="table-headers">
        <div className="header-blank"></div>
        <div className="header-title">NOM DE LA MATIÈRE</div>
        <div className="header-title">TYPE</div>
        <div className="header-title">DIMENSIONS RESTANTES</div>
        <div className="header-title">STOCK</div>
        <div className="header-blank"></div>
      </div>

      {/* Liste des lignes de matières */}
      <div className="rows-list">
        {matieres.map((mat) => (
          // mat.stock_id = identifiant 100% unique pour chaque matière, contrairement à mat.id
          <MatiereRow key={mat.stock_id} matiere={mat} onEdit={handleEdit} />
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
