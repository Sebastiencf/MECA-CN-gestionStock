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
                    m.code,
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

        

        case 'get_matiere' : 
            $nom = trim($body['nom'] ?? '');
            


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




        case 'cancel_history':
            $input = json_decode(file_get_contents('php://input'), true);
            $id = intval($input['id'] ?? 0);

            if ($id <= 0) {
                echo json_encode(['success' => false, 'message' => 'ID invalide']);
                exit;
            }

            // 1. Récupérer l'entrée d'historique
            $stmt = $pdo->prepare("
                SELECT h.*, m.nom AS matiere_nom
                FROM historique_stock h
                JOIN matieres m ON m.id = h.matiere_id
                WHERE h.id = ?
            ");
            $stmt->execute([$id]);
            $entry = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$entry) {
                echo json_encode(['success' => false, 'message' => 'Entrée introuvable']);
                exit;
            }

            $action_originale = $entry['action'];
            $valeur           = intval($entry['valeur_modification']);
            $matiere_id       = intval($entry['matiere_id']);
            $stock_id         = $entry['stock_unitaire_id'] ? intval($entry['stock_unitaire_id']) : null;

            try {
                $pdo->beginTransaction();

                // 2. Calculer la valeur inverse
                // valeur_modification est déjà signée (+3000 pour Ajout, -500 pour Conso)
                // On applique l'opposé sur stock_unitaire si stock_id connu, sinon sur le premier stock dispo
                $inverse = -$valeur;

                if ($action_originale === 'Création') {
                    // Annuler une Création = supprimer le stock_unitaire créé
                    if ($stock_id) {
                        $pdo->prepare("DELETE FROM stock_unitaire WHERE id = ?")->execute([$stock_id]);
                    }
                } elseif ($action_originale === 'Suppression') {
                    // Annuler une Suppression = on ne peut pas recréer la ligne facilement,
                    // on se contente de corriger le stock existant ou d'insérer une note
                    // Ici on ajoute la valeur absolue au premier stock dispo de la matière
                    $stmt2 = $pdo->prepare("SELECT id FROM stock_unitaire WHERE matiere_id = ? LIMIT 1");
                    $stmt2->execute([$matiere_id]);
                    $stock = $stmt2->fetch();
                    if ($stock) {
                        $pdo->prepare("UPDATE stock_unitaire SET longueur = longueur + ? WHERE id = ?")
                            ->execute([abs($valeur), $stock['id']]);
                    }
                } else {
                    // Ajout, Consommation, Mise au rebut, Modification
                    if ($stock_id) {
                        $pdo->prepare("UPDATE stock_unitaire SET longueur = longueur + ? WHERE id = ?")
                            ->execute([$inverse, $stock_id]);
                    } else {
                        // Pas de stock_unitaire_id précis → on applique sur le premier disponible
                        $stmt2 = $pdo->prepare("SELECT id FROM stock_unitaire WHERE matiere_id = ? LIMIT 1");
                        $stmt2->execute([$matiere_id]);
                        $stock = $stmt2->fetch();
                        if ($stock) {
                            $pdo->prepare("UPDATE stock_unitaire SET longueur = longueur + ? WHERE id = ?")
                                ->execute([$inverse, $stock['id']]);
                        }
                    }
                }

                // 3. Inscrire l'annulation dans l'historique
                $commentaire_annulation = "Annulation de : " . $entry['commentaire'];
                $pdo->prepare("
                    INSERT INTO historique_stock (matiere_id, stock_unitaire_id, action, valeur_modification, commentaire, origine)
                    VALUES (?, ?, 'Annulation', ?, ?, ?)
                ")->execute([
                    $matiere_id,
                    $stock_id,
                    $inverse,
                    $commentaire_annulation,
                    $entry['origine']
                ]);

                // 4. Supprimer l'entrée originale de l'historique
                $pdo->prepare("DELETE FROM historique_stock WHERE id = ?")->execute([$id]);

                $pdo->commit();
                echo json_encode(['success' => true]);

            } catch (Exception $e) {
                $pdo->rollBack();
                echo json_encode(['success' => false, 'message' => $e->getMessage()]);
            }
            break;




        // Si aucun des cas au-dessus n'a été sélectionné
        default:
            http_response_code(400);
            echo json_encode(['erreur' => "Action inconnue : $action"]);
            break;

    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['erreur' => $e->getMessage()]);
}