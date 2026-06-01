import React, { useState, useEffect } from 'react';
import MatiereRow from './MatiereRow';

function Dashboard() {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Connexion à ton API PHP locale développée sur Wamp
    fetch('http://localhost/gestion-des-stocks/api_stock.php')
      .then(res => res.json())
      .then(data => {
        setMatieres(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur API:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Chargement de l'inventaire...</div>;

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
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Rechercher une matière..." className="search-input" />
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
        {matieres.map(mat => (
            // On utilise mat.stock_id car il est 100% unique pour chaque ligne physique
            <MatiereRow key={mat.stock_id} matiere={mat} />
        ))}
        </div>
    </main>
  );
}

export default Dashboard;