import React, { useState, useEffect } from "react";
import { API_URL } from "./config";

function CollaboratorsMenu({ isOpen, onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: "",
    role: "Employé",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost/MECA-CN-gestionStock/api_stock.php?action=get_users",
      );
      const data = await response.json();
      setUsers(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Erreur API:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost/MECA-CN-gestionStock/api_stock.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "add_user",
            ...formData,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Collaborateur ajouté avec succès !");
        setFormData({ nom: "", role: "Employé" });
        await fetchUsers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Erreur : " + (data.message || "Impossible d'ajouter"));
      }
    } catch (error) {
      setMessage("❌ Erreur réseau : " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Supprimer ce collaborateur ?")) return;

    try {
      const response = await fetch(
        "http://localhost/MECA-CN-gestionStock/api_stock.php",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "delete_user",
            id: userId,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Collaborateur supprimé !");
        await fetchUsers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(
          "❌ Erreur : " + (data.message || "Impossible de supprimer"),
        );
      }
    } catch (error) {
      setMessage("❌ Erreur réseau : " + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="menu-overlay" onClick={onClose}>
      <div
        className="menu-container collaborators-menu"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="menu-header">
          <h2>Gérer les collaborateurs</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {message && (
          <div
            className={`message ${message.includes("✅") ? "success" : "error"}`}
          >
            {message}
          </div>
        )}

        {/* Formulaire d'ajout */}
        <div className="add-collaborator-section">
          <h3>Ajouter un collaborateur</h3>
          <form onSubmit={handleSubmit} className="collaborator-form">
            <div className="form-group">
              <label>Nom complet</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Ex : Jean Dupont"
                required
              />
            </div>

            <div className="form-group">
              <label>Rôle</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option>Admin</option>
                <option>Assistant</option>
                <option>Employé</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-add-collaborator"
            >
              👤 {isSubmitting ? "Ajout en cours..." : "Ajouter"}
            </button>
          </form>
        </div>

        {/* Liste des collaborateurs */}
        <div className="collaborators-list-section">
          <h3>Liste des membres ({users.length})</h3>
          {loading ? (
            <p>Chargement...</p>
          ) : users.length === 0 ? (
            <p className="no-users">Aucun collaborateur</p>
          ) : (
            <div className="collaborators-list">
              {users.map((user) => (
                <div key={user.id} className="collaborator-item">
                  <div
                    className="collaborator-badge"
                    style={{ backgroundColor: user.color || "#aa3bff" }}
                  >
                    {user.nom.charAt(0).toUpperCase()}
                  </div>
                  <div className="collaborator-info">
                    <h4>{user.nom}</h4>
                    <p>{user.role}</p>
                  </div>
                  <button
                    className="delete-collaborator-btn"
                    onClick={() => handleDelete(user.id)}
                    title="Supprimer"
                  >
                    <img src="/icons/delete-red.png" className="delete-red-icon" alt="Supprimer collaborateur" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollaboratorsMenu;
