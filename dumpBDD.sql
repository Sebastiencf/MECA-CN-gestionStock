-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 01 juin 2026 à 09:51
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `meca-cn-stocks`
--

-- --------------------------------------------------------

--
-- Structure de la table `historique_stock`
--

DROP TABLE IF EXISTS `historique_stock`;
CREATE TABLE IF NOT EXISTS `historique_stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matiere_id` int NOT NULL,
  `stock_unitaire_id` int DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `valeur_modification` int NOT NULL,
  `commentaire` text,
  `date_action` datetime DEFAULT CURRENT_TIMESTAMP,
  `origine` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_hist_matiere` (`matiere_id`),
  KEY `fk_hist_stock` (`stock_unitaire_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `historique_stock`
--

INSERT INTO `historique_stock` (`id`, `matiere_id`, `stock_unitaire_id`, `action`, `valeur_modification`, `commentaire`, `date_action`, `origine`) VALUES
(1, 1, 1, 'Ajout', 3000, 'Réception fournisseur - Commande #4521', '2026-05-27 16:19:45', NULL),
(2, 1, 2, 'Consommation', -500, 'Usinage de pièces sur MAZAK I200', '2026-05-27 16:19:45', NULL),
(3, 2, NULL, 'Consommation', -2000, 'Flux tendu : Reçu et débité directement pour l\'Acier XC38 (Urgence client)', '2026-05-27 16:19:45', NULL),
(4, 4, NULL, 'Mise au rebut', -400, 'Chute de laiton devenue inutilisable (trop courte)', '2026-05-27 16:19:45', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `matieres`
--

DROP TABLE IF EXISTS `matieres`;
CREATE TABLE IF NOT EXISTS `matieres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `type_forme` varchar(50) NOT NULL,
  `seuil_alerte_longueur` int DEFAULT '0',
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `code` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `matieres`
--

INSERT INTO `matieres` (`id`, `nom`, `type_forme`, `seuil_alerte_longueur`, `date_creation`, `code`) VALUES
(1, 'Aluminium 6060 (T6)', 'Cylindrique', 5000, '2026-05-27 16:06:01', NULL),
(2, 'Acier XC38 (C35)', 'Prisme', 3000, '2026-05-27 16:06:01', NULL),
(3, 'Inox 316L', 'Cylindrique', 4000, '2026-05-27 16:06:01', NULL),
(4, 'Laiton CuZn39Pb3', 'Cylindrique', 2000, '2026-05-27 16:06:01', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `stock_unitaire`
--

DROP TABLE IF EXISTS `stock_unitaire`;
CREATE TABLE IF NOT EXISTS `stock_unitaire` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matiere_id` int NOT NULL,
  `longueur` int NOT NULL DEFAULT '0',
  `d_x` int DEFAULT NULL,
  `d_y` int DEFAULT NULL,
  `diametre` int DEFAULT NULL,
  `statut` varchar(50) DEFAULT 'Disponible',
  `date_entree` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_matiere_id` (`matiere_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `stock_unitaire`
--

INSERT INTO `stock_unitaire` (`id`, `matiere_id`, `longueur`, `d_x`, `d_y`, `diametre`, `statut`, `date_entree`, `date_modification`) VALUES
(1, 1, 3000, NULL, NULL, 50, 'Neuf', '2026-05-27 16:06:01', '2026-05-27 16:06:01'),
(2, 1, 2500, NULL, NULL, 50, 'Entamé', '2026-05-27 16:06:01', '2026-05-27 16:06:01'),
(3, 1, 700, NULL, NULL, 30, 'Entamé', '2026-05-27 16:06:01', '2026-05-27 16:07:06'),
(4, 2, 2000, 100, 50, NULL, 'Entamé', '2026-05-27 16:06:01', '2026-05-27 16:06:01'),
(5, 2, 300, 60, 60, NULL, 'Chute', '2026-05-27 16:06:01', '2026-05-27 16:06:01'),
(6, 3, 0, NULL, NULL, 20, 'Hors-stock', '2026-05-27 16:06:01', '2026-06-01 10:38:53'),
(7, 3, 3500, NULL, NULL, 20, 'Entamé', '2026-05-27 16:06:01', '2026-05-27 16:06:01'),
(8, 4, 400, NULL, NULL, 40, 'Chute', '2026-05-27 16:06:01', '2026-05-27 16:06:01');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `actif` tinyint(1) DEFAULT '1',
  `role` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `nom`, `date_creation`, `actif`, `role`) VALUES
(2, 'Test', '2026-06-01 09:08:21', 1, 'Employé'),
(3, 'Tes Agent Employé', '2026-06-01 09:08:33', 1, 'Employé'),
(4, 'Atest', '2026-06-01 09:08:38', 1, 'Employé'),
(5, 'Atest', '2026-06-01 09:08:48', 1, 'Admin');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `historique_stock`
--
ALTER TABLE `historique_stock`
  ADD CONSTRAINT `fk_historique_matiere` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_historique_stock` FOREIGN KEY (`stock_unitaire_id`) REFERENCES `stock_unitaire` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Contraintes pour la table `stock_unitaire`
--
ALTER TABLE `stock_unitaire`
  ADD CONSTRAINT `fk_stock_matiere` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
