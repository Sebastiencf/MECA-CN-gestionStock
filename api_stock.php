<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = null;

if ($method === 'GET') {
    $action = $_GET['action'] ?? null;
} else {
    $body = json_decode(file_get_contents('php://input'), true);
    $action = $body['action'] ?? null;
}

try {
    switch ($action) {

        case null:
        case 'get_stock':
            $stmt = $pdo->query("
                SELECT 
                    s.id AS stock_id,
                    m.id AS matiere_id,
                    m.nom,
                    m.type_forme,
                    m.seuil_alerte_longueur,
                    s.longueur,
                    s.d_x,
                    s.d_y,
                    s.diametre,
                    s.statut,
                    m.code
                FROM stock_unitaire s
                INNER JOIN matieres m ON s.matiere_id = m.id
                ORDER BY m.nom ASC, s.longueur DESC
            ");
            echo json_encode($stmt->fetchAll());
            break;

        case 'get_users':
            $stmt = $pdo->query("SELECT * FROM utilisateurs WHERE actif = 1 ORDER BY nom ASC");
            echo json_encode($stmt->fetchAll());
            break;

        case 'add_user':
            $nom  = trim($body['nom']  ?? '');
            $role = trim($body['role'] ?? 'Employé');

            if (empty($nom)) {
                echo json_encode(['success' => false, 'message' => 'Le nom est requis']);
                break;
            }

            $stmt = $pdo->prepare("INSERT INTO utilisateurs (nom, role) VALUES (?, ?)");
            $stmt->execute([$nom, $role]);
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;

        case 'delete_user':
            $id = intval($body['id'] ?? 0);

            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'ID invalide']);
                break;
            }

            $stmt = $pdo->prepare("DELETE FROM utilisateurs WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
            break;

        case 'get_history':
            $stmt = $pdo->query("
                SELECT 
                    h.id,
                    h.matiere_id,
                    h.stock_unitaire_id,
                    h.action,
                    h.commentaire,
                    COALESCE(u.nom, h.origine, 'Système') AS user,
                    h.valeur_modification,
                    m.nom AS matiere_nom,
                    m.type_forme,
                    h.date_action AS date
                FROM historique_stock h
                LEFT JOIN matieres m ON h.matiere_id = m.id
                LEFT JOIN utilisateurs u ON CAST(h.origine AS UNSIGNED) = u.id
                ORDER BY h.date_action DESC
                LIMIT 500
            ");
            $results = $stmt->fetchAll();
            echo json_encode($results ?: []);
            break;

        case 'add':
            $nom = trim($body['nom'] ?? '');
            $code = trim($body['identifiant'] ?? '');
            $forme = trim($body['forme'] ?? '');
            $autreForme = trim($body['autreFormeRecherche'] ?? '');
            $longueur = ($body['longueur'] !== '' && $body['longueur'] !== null) ? floatval($body['longueur']) : 0;
            $diametre = ($body['diametre'] !== '' && $body['diametre'] !== null) ? floatval($body['diametre']) : null;
            $dimensionX = ($body['dimensionX'] !== '' && $body['dimensionX'] !== null) ? floatval($body['dimensionX'])  : null;
            $dimensionY = ($body['dimensionY'] !== '' && $body['dimensionY'] !== null) ? floatval($body['dimensionY'])  : null;
            $seuilAlerte = ($body['seuilAlerte'] !== '' && $body['seuilAlerte'] !== null) ? floatval($body['seuilAlerte']) : null;
            $etat  = trim($body['etat'] ?? '');

            if (empty($nom) || empty($forme) || empty($etat) || $seuilAlerte === null) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Champs obligatoires manquants']);
                break;
            }

            $typeForme = $forme === 'Autre' ? $autreForme : $forme;

            // 1. Insérer la matière
            $stmt = $pdo->prepare("
                INSERT INTO matieres (nom, code, type_forme, seuil_alerte_longueur)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$nom, $code, $typeForme, $seuilAlerte]);
            $matiereId = $pdo->lastInsertId();

            // 2. Insérer le stock unitaire associé
            $stmt = $pdo->prepare("
                INSERT INTO stock_unitaire (matiere_id, longueur, diametre, d_x, d_y, statut)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$matiereId, $longueur, $diametre, $dimensionX, $dimensionY, $etat]);

            echo json_encode(['success' => true, 'matiere_id' => $matiereId]);
            break;

        case 'delete':
            $id = intval($body['id'] ?? '');
            $stmt = $pdo->prepare("
                DELETE FROM stock_unitaire WHERE id = ?
            ");
            $stmt->execute([$id]);

            echo json_encode(['success' => true]);
            break;

        default:
            http_response_code(400);
            echo json_encode(['erreur' => "Action inconnue : $action"]);
            break;

    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erreur' => $e->getMessage()]);
}