import React, { useState, useEffect } from "react";

function ModifMatiere({ matiere }) {
  const [formData, setFormData] = useState({
    nom: "",
    identifiant: "",
    forme: "",
    autreFormeRecherche: "",
    longueur: "",
    diametre: "",
    dimensionX: "",
    dimensionY: "",
    seuilAlerte: "",
    etat: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialiser le formulaire avec les données de la matière
  useEffect(() => {
    if (matiere) {
      setFormData({
        nom: matiere.nom || "",
        identifiant: matiere.identifiant || "",
        forme: matiere.type_forme || "",
        autreFormeRecherche: "",
        longueur: matiere.longueur || "",
        diametre: matiere.diametre || "",
        dimensionX: matiere.d_x || "",
        dimensionY: matiere.d_y || "",
        seuilAlerte: "",
        etat: matiere.statut || "",
      });
    }
  }, [matiere]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost/gestion-des-stocks/api_stock.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "update",
            stock_id: matiere?.stock_id,
            ...formData,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Matière modifiée avec succès !");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(
          "❌ Erreur : " +
            (data.message || "Impossible de modifier la matière"),
        );
      }
    } catch (error) {
      setMessage("❌ Erreur réseau : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!matiere) {
    return (
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h2 className="main-title">Erreur</h2>
          <p className="main-subtitle">Aucune matière sélectionnée</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-main add-matiere-container">
      <div className="dashboard-header">
        <div>
          <h2 className="main-title">Modifier une matière</h2>
          <p className="main-subtitle">
            Modifiez les informations de la matière sélectionnée
          </p>
        </div>
      </div>

      <div className="add-matiere-layout">
        {/* Formulaire à gauche */}
        <div className="form-section">
          <form onSubmit={handleSubmit} className="add-form">
            {/* Informations générales */}
            <div className="form-section-block">
              <h3 className="form-section-title">Informations générales</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nom">Nom de la matière *</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Ex: Aluminium"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="identifiant">
                    Identifiant de la matière *
                  </label>
                  <input
                    type="text"
                    id="identifiant"
                    name="identifiant"
                    value={formData.identifiant}
                    onChange={handleChange}
                    placeholder="Ex: ALU-6060"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Formulaire de la matière */}
            <div className="form-section-block">
              <h3 className="form-section-title">Formulaire de la matière</h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="forme">Forme de la matière *</label>
                  <select
                    id="forme"
                    name="forme"
                    value={formData.forme}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="Cylindrique">Cylindrique</option>
                    <option value="Prisme">Prisme</option>
                    <option value="Plaque">Plaque</option>
                    <option value="Profil">Profil</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                {formData.forme === "Autre" && (
                  <div className="form-group">
                    <label htmlFor="autreFormeRecherche">
                      Si autre, veuillez la renseigner *
                    </label>
                    <input
                      type="text"
                      id="autreFormeRecherche"
                      name="autreFormeRecherche"
                      value={formData.autreFormeRecherche}
                      onChange={handleChange}
                      placeholder="Ex: Poudre"
                      required={formData.forme === "Autre"}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Dimensions */}
            <div className="form-section-block">
              <h3 className="form-section-title">Dimensions</h3>
              <p className="form-section-subtitle">
                Veuillez renseigner uniquement les dimensions correspondant à
                votre pièce
              </p>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="longueur">Longueur (mm)</label>
                  <input
                    type="number"
                    id="longueur"
                    name="longueur"
                    value={formData.longueur}
                    onChange={handleChange}
                    placeholder="Ex: 6000mm"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="diametre">Diamètre (mm)</label>
                  <input
                    type="number"
                    id="diametre"
                    name="diametre"
                    value={formData.diametre}
                    onChange={handleChange}
                    placeholder="Ex: 200mm"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dimensionX">Dimension X (mm)</label>
                  <input
                    type="number"
                    id="dimensionX"
                    name="dimensionX"
                    value={formData.dimensionX}
                    onChange={handleChange}
                    placeholder="Ex: 250mm"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dimensionY">Dimension Y (mm)</label>
                  <input
                    type="number"
                    id="dimensionY"
                    name="dimensionY"
                    value={formData.dimensionY}
                    onChange={handleChange}
                    placeholder="Ex: 200mm"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="seuilAlerte">Seuil d'alerte (mm) *</label>
                  <input
                    type="number"
                    id="seuilAlerte"
                    name="seuilAlerte"
                    value={formData.seuilAlerte}
                    onChange={handleChange}
                    placeholder="Ex: 200mm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* État de la matière */}
            <div className="form-section-block">
              <h3 className="form-section-title">État de la matière</h3>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="etat">État *</label>
                  <select
                    id="etat"
                    name="etat"
                    value={formData.etat}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="Neuf">Neuf</option>
                    <option value="Entamé">Entamé</option>
                    <option value="Chute">Chute</option>
                  </select>
                </div>
              </div>
            </div>

            {message && (
              <div
                className={`message-alert ${message.includes("✅") ? "success" : "error"}`}
              >
                {message}
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn-valider">
              {isLoading ? "Modification en cours..." : "Valider"}
            </button>
          </form>
        </div>

        {/* Récapitulatif à droite */}
        <div className="recap-section">
          <h3 className="recap-title">Récapitulatif des informations</h3>

          {/* Identification */}
          <div className="recap-block">
            <h4 className="recap-block-title">Identification</h4>
            <div className="recap-item">
              <span className="recap-label">Nom</span>
              <span className="recap-value">{formData.nom || "—"}</span>
            </div>
            <div className="recap-item">
              <span className="recap-label">Appellation technique</span>
              <span className="recap-value">{formData.identifiant || "—"}</span>
            </div>
            <div className="recap-item">
              <span className="recap-label">Forme</span>
              <span className="recap-value">
                {formData.forme === "Autre"
                  ? formData.autreFormeRecherche
                  : formData.forme || "—"}
              </span>
            </div>
          </div>

          {/* Dimensions */}
          <div className="recap-block">
            <h4 className="recap-block-title">Dimensions</h4>
            <div className="recap-item">
              <span className="recap-label">Longueur</span>
              <span className="recap-value">
                {formData.longueur ? `${formData.longueur}mm` : "—"}
              </span>
            </div>
            <div className="recap-item">
              <span className="recap-label">Diamètre</span>
              <span className="recap-value">
                {formData.diametre ? `${formData.diametre}mm` : "—"}
              </span>
            </div>
            <div className="recap-item">
              <span className="recap-label">Dimension X</span>
              <span className="recap-value">
                {formData.dimensionX ? `${formData.dimensionX}mm` : "—"}
              </span>
            </div>
            <div className="recap-item">
              <span className="recap-label">Dimension Y</span>
              <span className="recap-value">
                {formData.dimensionY ? `${formData.dimensionY}mm` : "—"}
              </span>
            </div>
            <div className="recap-item">
              <span className="recap-label">Seuil d'alerte</span>
              <span className="recap-value">
                {formData.seuilAlerte ? `${formData.seuilAlerte}mm` : "—"}
              </span>
            </div>
          </div>

          {/* État de la matière */}
          <div className="recap-block">
            <h4 className="recap-block-title">État de la matière</h4>
            <div className="recap-item">
              <span className="recap-label">État</span>
              <span className="recap-value">{formData.etat || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ModifMatiere;
