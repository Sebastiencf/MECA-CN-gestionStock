import React, { useState, useEffect } from "react";
import { API_URL } from "./config";

function DeleteMatiere() {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    // Charger la liste des matières
    fetch(API_URL)
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

  const handleDelete = async (id) => {


    console.log("ID envoyé à l'API :", id)

    
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette matière ?")) {
      return;
    }

    setDeleting(id);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost/MECA-CN-gestionStock/api_stock.php",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "delete",
            id: id,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Matière supprimée avec succès !");
        // Retirer la matière de la liste
        setMatieres(matieres.filter((m) => m.stock_id !== id));
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(
          "❌ Erreur : " +
            (data.message || "Impossible de supprimer la matière"),
        );
      }
    } catch (error) {
      setMessage("❌ Erreur réseau : " + error.message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading)
    return <div className="loading">Chargement de l'inventaire...</div>;

  return (
    <main className="dashboard-main">
      <div className="dashboard-header">
        <div>
          <h2 className="main-title">Choisissez la matière à supprimer</h2>
          <p className="main-subtitle">Retirer un matériau de l'inventaire</p>
        </div>
        <div className="search-container">
          <span className="search-icon"><img src="/icons/loupe_light.png" alt="Barre dde recherche" className="loupe-icon"/></span>
          <input type="text" placeholder="Rechercher une matière..." className="search-input" />
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      {/* En-têtes identiques au Dashboard */}
      <div className="table-headers">
        <div className="header-blank"></div>
        <div className="header-title">NOM DE LA MATIÈRE</div>
        <div className="header-title">TYPE</div>
        <div className="header-title">DIMENSIONS RESTANTES</div>
        <div className="header-title">STOCK</div>
        <div className="header-blank"></div>
      </div>

      <div className="delete-container">
        {matieres.length === 0 ? (
          <p className="no-matieres">Aucune matière à supprimer</p>
        ) : (
          <div className="delete-list">
            {matieres.map((matiere) => (
              <div key={matiere.stock_id} className="delete-item">

                {/* première colonne : icône statut — identique à MatiereRow */}
                {matiere.statut === "Neuf"    && <div className="status-icon icon-ok">✔️</div>}
                {matiere.statut === "Entamé"  && <div className="status-icon icon-fin">⏳</div>}
                {matiere.statut === "Chute"   && <div className="status-icon icon-alerte">⚠️</div>}
                {!["Neuf","Entamé","Chute"].includes(matiere.statut) && <div className="status-icon icon-rupture">❌</div>}

                {/* Colonnes 2 à 5 regroupées dans delete-item-info */}
                <div className="delete-item-info">

                  {/* Nom */}
                  <div>
                    <h3>{matiere.nom}</h3>
                    <span className="matiere-sub-id">#{matiere.stock_id}</span>
                  </div>

                  {/* Type */}
                  <div className="item-type">{matiere.type_forme}</div>

                  {/* Dimensions */}
                  <div className="item-dims">
                    {["Méplat","Bloc","Carré","Prisme"].includes(matiere.type_forme) ? (
                      <>
                        <div><strong>Dimensions :</strong> {matiere.d_x || 0} x {matiere.d_y || 0} mm</div>
                        <div><strong>Longueur :</strong> {matiere.longueur} mm</div>
                      </>
                    ) : (
                      <>
                        <div><strong>Longueur :</strong> {matiere.longueur} mm</div>
                        {matiere.diametre && <div><strong>Diamètre :</strong> Ø {matiere.diametre} mm</div>}
                      </>
                    )}
                  </div>

                  {/* Badge statut */}
                  <div>
                    <span className={`stock-badge ${
                      matiere.statut === "Neuf"   ? "badge-ok"    :
                      matiere.statut === "Entamé" ? "badge-fin"   :
                      matiere.statut === "Chute"  ? "badge-chute" : "badge-rupture"
                    }`}>
                      {matiere.statut}
                    </span>
                  </div>
                </div>

                {/* 6ème colonne : bouton suppression */}
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(matiere.stock_id)}
                  disabled={deleting === matiere.stock_id}
                  title="Supprimer ce morceau"
                >
                  {deleting === matiere.stock_id ? "⏳" : "🗑️"}
                </button>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default DeleteMatiere;
