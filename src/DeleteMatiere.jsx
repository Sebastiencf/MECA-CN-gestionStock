import React, { useState, useEffect } from "react";

function DeleteMatiere() {
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    // Charger la liste des matières
    fetch("http://localhost/gestion-des-stocks/api_stock.php")
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
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette matière ?")) {
      return;
    }

    setDeleting(id);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost/gestion-des-stocks/api_stock.php",
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
        setMatieres(matieres.filter((m) => m.id !== id));
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
          <h2 className="main-title">Supprimer une matière</h2>
          <p className="main-subtitle">Retirer un matériau de l'inventaire</p>
        </div>
      </div>

      {message && (
        <div
          className={`message ${message.includes("✅") ? "success" : "error"}`}
        >
          {message}
        </div>
      )}

      <div className="delete-container">
        {matieres.length === 0 ? (
          <p className="no-matieres">Aucune matière à supprimer</p>
        ) : (
          <div className="delete-list">
            {matieres.map((matiere) => (
              <div key={matiere.id} className="delete-item">
                <div className="delete-item-info">
                  <h3>{matiere.nom}</h3>
                  <p>Type: {matiere.type}</p>
                  <p>{matiere.dimensions}</p>
                </div>
                <button
                  onClick={() => handleDelete(matiere.id)}
                  disabled={deleting === matiere.id}
                  className="btn-delete"
                >
                  {deleting === matiere.id ? "Suppression..." : "Supprimer"}
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
