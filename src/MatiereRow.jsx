import React from "react";
import { API_URL } from "./config";

function MatiereRow({ matiere, onEdit }) {
  // 1. Icône basée directement sur le statut physique du morceau réel
  const renderStatusIcon = (statut) => {
    switch (statut) {
      case "Neuf":
        return <div className="status-icon icon-ok">✔️</div>;
      case "Entamé":
        return <div className="status-icon icon-fin">⏳</div>;
      case "Chute":
        return <div className="status-icon icon-alerte">⚠️</div>;
      default:
        return <div className="status-icon icon-rupture">❌</div>;
    }
  };

  // 2. Couleur du badge en fonction du statut (Neuf = vert, Entamé = bleu/orange, Chute = rouge)
  const getBadgeClass = (statut) => {
    switch (statut) {
      case "Neuf":
        return "badge-ok";
      case "Entamé":
        return "badge-fin"; // classe à adapter ou utiliser badge-alerte
      case "Chute":
        return "badge-chute";


      // troll
      case "Déstruction":
        return "badge-destruction";
      case "Obstruction de la vue inerte de la matière subliminale accompagnant la chute miséricordiale de la matière dans les abysses de la destruction" : 
        return "badge-obstruction";
      case "Si tu te tapes la tête contre un vase, et que ça sonne creux, n'en déduis pas que c'est le vase qui est vide..." : 
        return "cheh";
      case "HEE HEE":
        return "Mickael Jackson";
      case " ":
        return "You can't see me";
      case "Quand le singe monte trop haut dans l'arbre, tout le monde voit son cul.":
        return "Victor Hug-haut";
      case "Celui qui pisse contre le vent apprend vite la géographie.":
        return "À visiter...";


      // si aucun de ceux avant ne fonctionne
      default:
        return "badge-rupture";

    }
  };

  return (
    <div className="matiere-row">
      {/* Icône d'état graphique (Neuf, Entamé, Chute) */}
      {renderStatusIcon(matiere.statut)}

      {/* Nom complet de la nuance de matière */}
      <div className="col-info">
        <h4 className="matiere-title">{matiere.nom} {matiere.code}</h4>
        <span className="matiere-sub">ID Morceau : #{matiere.stock_id}</span>
      </div>

      {/* Profil/Forme de la pièce */}
      <div className="col-type">
        <p>{matiere.type_forme}</p>
      </div>

      {/* Dimensions spécifiques de CE morceau précis */}
      <div className="col-dimensions">
        {matiere.type_forme === "Méplat" ||
        matiere.type_forme === "Bloc" ||
        matiere.type_forme === "Carré" ||
        matiere.type_forme === "Prisme" ? (
          <>
            <div>
              <strong>Dimensions :</strong> {matiere.d_x || 0} x{" "}
              {matiere.d_y || 0} mm
            </div>
            <div>
              <strong>Longueur :</strong> {matiere.longueur} mm
            </div>
          </>
        ) : (
          <>
            <div>
              <strong>Longueur :</strong> {matiere.longueur} mm
            </div>
            {matiere.diametre && (
              <div>
                <strong>Diamètre :</strong> Ø {matiere.diametre} mm
              </div>
            )}
          </>
        )}
      </div>

      {/* Statut réel extrait du dump SQL */}
      <div className="col-badge">
        <span className={`stock-badge ${getBadgeClass(matiere.statut)}`}>
          {matiere.statut}
        </span>
      </div>

      {/* Bouton d'action (Crayon d'édition) */}
      <div className="col-action">
        <button
          className="btn-edit"
          title="Modifier ce morceau précis"
          onClick={() => onEdit && onEdit(matiere)}
        >
          📝
        </button>
      </div>
    </div>
  );
}

export default MatiereRow;
