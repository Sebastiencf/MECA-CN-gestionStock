-- Script pour ajouter des données de test complètes à l'historique

-- Vider les données existantes (optionnel)
-- TRUNCATE TABLE historique_stock;

-- Insérer des données de test avec origines remplies
INSERT INTO `historique_stock` (`matiere_id`, `stock_unitaire_id`, `action`, `valeur_modification`, `commentaire`, `date_action`, `origine`) VALUES

-- Sylvain Prudhomme - Ajout
(1, 1, 'Ajout', 3000, 'Barre Ronde Aluminium', '2026-05-27 08:30:00', 'Sylvain Prudhomme'),

-- Sylvain Prudhomme - Consommation
(1, 2, 'Consommation', -500, 'Carré Aluminium', '2026-05-27 09:15:00', 'Sylvain Prudhomme'),

-- Marc-Antoine Pignon - Consommation
(2, NULL, 'Consommation', -2000, 'Barre Ronde Acier', '2026-05-28 10:45:00', 'Marc-Antoine Pignon'),

-- Olivier Doyer - Ajout
(3, NULL, 'Ajout', 1500, 'Barre Ronde Inox', '2026-05-28 14:20:00', 'Olivier Doyer'),

-- Ludovic Bucamp - Consommation
(4, NULL, 'Consommation', -400, 'Tube Aluminium', '2026-05-29 11:00:00', 'Ludovic Bucamp'),

-- Sébastien Coissin - Consommation
(1, 3, 'Consommation', -300, 'Six pans Plastique', '2026-05-29 15:30:00', 'Sébastien Coissin'),

-- Ludovic Bucamp - Consommation
(2, NULL, 'Consommation', -600, 'Barre Ronde Aluminium', '2026-05-30 09:00:00', 'Ludovic Bucamp'),

-- Sylvain Prudhomme - Ajout
(3, NULL, 'Ajout', 2400, 'Six pans Aluminium', '2026-05-30 13:45:00', 'Sylvain Prudhomme'),

-- Olivier Doyer - Création
(4, NULL, 'Création', 1, 'Miroir Composites', '2026-05-31 08:00:00', 'Olivier Doyer'),

-- Marc-Antoine Pignon - Suppression
(1, NULL, 'Suppression', 1, 'Méplat Composites', '2026-05-31 16:20:00', 'Marc-Antoine Pignon');
