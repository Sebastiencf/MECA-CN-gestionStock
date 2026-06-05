import React, { useState, useEffect, useRef } from "react";
import { API_URL } from "./config";

function FluxManagement() {
  const [flux, setFlux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("Tous");
  const [filterOrigin, setFilterOrigin] = useState("Tous les collaborateurs");
  const [filterPeriod, setFilterPeriod] = useState("Derniers 30 jours");
  const tableBodyRef = useRef(null);

  useEffect(() => {
    fetchFlux();
  }, []);

  useEffect(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = 0;
    }
  }, [filterPeriod, filterAction, filterOrigin, searchTerm]);

const fetchFlux = async () => {
  try {
    const response = await fetch(
      "http://localhost/MECA-CN-gestionStock/api_stock.php?action=get_history",
    );
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    setFlux(data || []);
    // console.log("Total reçu : ", data.length);
    setLoading(false);
  } catch (error) {
    console.error("Erreur API:", error);
    setFlux([]);
    setLoading(false);
  }
};

  const getActionBadgeClass = (action) => {
    switch (action) {
      case "Ajout":
        return "badge-add";
      case "Consommation":
        return "badge-consumption";
      case "Modification":
        return "badge-modify";
      default:
        return "badge-default";
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "Ajout":
        return "#22c55e";
      case "Consommation":
        return "#ef4444";
      case "Modification":
        return "#2196f3";
      default:
        return "#9ca3af";
    }
  };

  const formatQuantity = (action, value) => {
    if (value == null) return "-";

    const absValue = Math.abs(value);

    if (action === "Ajout") {
      return `+${absValue} mm`;
    }

    if (action === "Suppression" || action === "Mise au rebut") {
      return `-${absValue} mm`;
    }

    return `${value} mm`;
  };

  //console.log("filterPeriod actuel:", filterPeriod);


  const filteredFlux = flux.filter((item) => {
    try {
      const matchSearch =
        searchTerm === "" ||
        (item.commentaire && item.commentaire.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.matiere_nom && item.matiere_nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.action && item.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.user && item.user.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchAction =
        filterAction === "Tous" || item.action === filterAction;
      const matchOrigin =
        filterOrigin === "Tous les collaborateurs" ||
        item.user === filterOrigin;

      let matchPeriod = true;
      if (filterPeriod === "Derniers 30 jours" && item.date) {
        
        const isoDateString = item.date.replace(" ", "T");
        const itemDate = new Date(isoDateString);
        
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);

        // Sécurité : on vérifie que la date est valide avant de comparer
        if (!isNaN(itemDate.getTime())) {
          matchPeriod = itemDate >= cutoff;
        } else {
          matchPeriod = false; 
        }
      }

      return matchSearch && matchAction && matchOrigin && matchPeriod;
    } catch (err) {
      console.error("Erreur lors du filtrage:", item, err);
      return false;
    }
  });

  const exportToCSV = () => {
    const headers = [
      "Utilisateur et Date",
      "Action",
      "Détails de la matière",
      "Quantité",
    ];
    const rows = filteredFlux.map((item) => [
      item.user,
      item.action,
      item.commentaire,
      item.valeur_modification || "-",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gestion-des-flux-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };


  const uniqueOrigins = [...new Set(flux.map((item) => item.user))];
  const uniqueActions = [...new Set(flux.map((item) => item.action))];

  
  const handleCancel = async (item) => {
    const confirmMsg = `Annuler cette action ?\n"${item.action} – ${item.matiere_nom} (${item.valeur_modification > 0 ? '+' : ''}${item.valeur_modification} mm)"\n\nL'opération inverse sera appliquée automatiquement.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const response = await fetch(
        "http://localhost/MECA-CN-gestionStock/api_stock.php?action=cancel_history",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Action annulée avec succès.");
        fetchFlux(); // Recharge la liste
      } else {
        alert("Erreur : " + (data.message || "Impossible d'annuler."));
      }
    } catch (err) {
      console.error("Erreur annulation :", err);
      alert("Erreur réseau lors de l'annulation.");
    }
  };


  //console.log("filteredFlux:", filteredFlux.length, filteredFlux.map(i => i.action));

  if (loading) {
    return (
      <main className="dashboard-main flux-management">
        <div className="loading">Chargement des flux...</div>
      </main>
    );
  }

  if (!flux || flux.length === 0) {
    return (
      <main className="dashboard-main flux-management">
        <div className="dashboard-header">
          <div>
            <h2 className="main-title">Gestion des flux</h2>
            <p className="main-subtitle">Aucun flux trouvé</p>
          </div>
        </div>
        <div className="no-flux">Aucun historique disponible</div>
      </main>
    );
  }


  // console.log("Nb items affichés:", filteredFlux.length, "| filterPeriod:", filterPeriod);
  return (
    <main className="dashboard-main flux-management">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2 className="main-title">Gestion des flux</h2>
          <p className="main-subtitle">
            Surveillez et gérez l’intégralité de l’historique des modifications de votre stock
          </p>
        </div>
        <button className="btn-export-csv" onClick={exportToCSV}>
          <img src="/icons/download.png" alt="Icone d'export en CSV" className="upload-icon"/> Exporter CSV
        </button>
      </div>

      {/* Filtres */}
      <div className="flux-filters">
        <div className="filter-section">
          <span className="filter-label">FILTRE</span>
          <div className="filter-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={filterPeriod === "Derniers 30 jours"}
                onChange={(e) => setFilterPeriod(e.target.checked ? "Derniers 30 jours" : "Tous")}
              />
              Derniers 30 jours
            </label>
          </div>
        </div>

        <div className="filter-section">
          <span className="filter-label">UTILISATEUR</span>
          <select
            value={filterOrigin}
            onChange={(e) => setFilterOrigin(e.target.value)}
            className="filter-select"
          >
            <option>Tous les collaborateurs</option>
            {uniqueOrigins.map((origin) => (
              <option key={origin} value={origin}>
                {origin}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <span className="filter-label">ACTIONS</span>
          <div className="action-buttons">
            {["Tous", ...uniqueActions].map((action) => (
              <button
                key={action}
                className={`action-btn ${filterAction === action ? "active" : ""}`}
                onClick={() => setFilterAction(action)}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Barre de recherche (cherche sur à peu près tout les éléments, sauf les quantité) */}
      <div className="flux-search">
        <input
          type="text"
          placeholder="Rechercher une opération..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Headers de la table */}
      <div className="flux-table">
        <div className="table-header">
          <div className="col-user">UTILISATEUR ET DATE</div>
          <div className="col-action">ACTION</div>
          <div className="col-details">DÉTAILS DE LA MATIÈRE</div>
          <div className="col-quantity">QUANTITÉ</div>
        </div>

        {/* Lignes de la table */}
        <div className="table-body" ref={tableBodyRef}>
          {filteredFlux.length === 0 ? (
            <div className="no-flux">
              Aucun flux correspondant à vos critères
            </div>
          ) : (
            filteredFlux.map((item) => (
              <div key={item.id} className="table-row">
                <div className="col-user">
                  <div
                    className="user-badge"
                    style={{ backgroundColor: getActionColor(item.action) }}
                  >
                    {item.user && item.user.length > 0
                      ? item.user.charAt(0).toUpperCase()
                      : "S"}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{item.user || "Système"}</div>
                    <div className="user-date">
                      {item.date 
                        ? new Date(item.date.replace(" ", "T")).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        : "-"}
                    </div>
                  </div>
                </div>

                <div className="col-action">
                  <span
                    className={`action-badge ${getActionBadgeClass(item.action)}`}
                  >
                    {item.action || "-"}
                  </span>
                </div>

                <div className="col-details">
                  <div className="detail-text">
                    <strong>{item.matiere_nom || "-"} {item.code || "-"}</strong>
                    <br />
                    <small>{item.type_forme || "-"}</small>
                  </div>
                </div>

                <div className="col-quantity">
                      <div className="quantity-value">
                        {formatQuantity(item.action, item.valeur_modification)}
                      </div>
                </div>

                <div className="col-actions">
                  <button
                    className="btn-action btn-cancel"
                    title="Annuler cette action"
                    onClick={() => handleCancel(item)}
                  >
                    ↩ Annuler
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default FluxManagement;
