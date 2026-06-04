-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 04 juin 2026 à 06:11
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
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `historique_stock`
--

INSERT INTO `historique_stock` (`id`, `matiere_id`, `stock_unitaire_id`, `action`, `valeur_modification`, `commentaire`, `date_action`, `origine`) VALUES
(25, 1, 1, 'Ajout', 3000, 'Barre Ronde Aluminium', '2026-05-27 08:30:00', 'Sylvain Prudhomme'),
(26, 1, 2, 'Consommation', -500, 'Carré Aluminium', '2026-05-27 09:15:00', 'Sylvain Prudhomme'),
(27, 2, NULL, 'Consommation', -2000, 'Barre Ronde Acier', '2026-05-28 10:45:00', 'Marc-Antoine Pignon'),
(28, 3, NULL, 'Ajout', 1500, 'Barre Ronde Inox', '2026-05-28 14:20:00', 'Olivier Doyer'),
(29, 4, 8, 'Consommation', -400, 'Tube Aluminium', '2026-05-29 11:00:00', 'Ludovic Bucamp'),
(31, 2, 4, 'Consommation', -600, 'Barre Ronde Acier', '2026-05-30 09:00:00', 'Ludovic Bucamp'),
(32, 3, 6, 'Ajout', 2400, 'Six pans Inox', '2026-05-30 13:45:00', 'Sylvain Prudhomme'),
(33, 4, NULL, 'Création', 1, 'Miroir Composites', '2026-05-31 08:00:00', 'Olivier Doyer'),
(34, 1, NULL, 'Suppression', 1, 'Méplat Composites', '2026-05-31 16:20:00', 'Marc-Antoine Pignon'),
(35, 7, NULL, 'Ajout', 4000, 'Réception barre Alu 7075', '2026-05-04 07:45:00', 'Sylvain Legrand'),
(36, 9, NULL, 'Consommation', -600, 'Usinage arbre acier 42CrMo4', '2026-05-05 09:20:00', 'Sylvain Legrand'),
(37, 12, NULL, 'Consommation', -300, 'Tournage inox 304L', '2026-05-07 14:10:00', 'Sylvain Legrand'),
(38, 18, NULL, 'Ajout', 4000, 'Réception barre titane TA6V', '2026-05-10 08:00:00', 'Sylvain Legrand'),
(39, 20, NULL, 'Consommation', -500, 'Fraisage POM-C pièce prototype', '2026-05-12 11:30:00', 'Sylvain Legrand'),
(40, 1, NULL, 'Consommation', -800, 'Débit alu 6060 pour série client', '2026-05-14 13:00:00', 'Sylvain Legrand'),
(41, 14, NULL, 'Mise au rebut', -250, 'Chute laiton CuZn37 trop courte', '2026-05-16 15:45:00', 'Sylvain Legrand'),
(42, 23, NULL, 'Ajout', 1000, 'Réception plaque carbone', '2026-05-19 09:00:00', 'Sylvain Legrand'),
(43, 8, NULL, 'Consommation', -400, 'Fraisage plaque alu 2017A', '2026-05-21 10:15:00', 'Sylvain Legrand'),
(44, 19, NULL, 'Consommation', -200, 'Usinage titane T40 pièce aéro', '2026-05-23 16:00:00', 'Sylvain Legrand'),
(45, 10, NULL, 'Ajout', 2000, 'Réception plaque acier S235', '2026-05-04 08:30:00', 'Sébastien Cousin'),
(46, 2, NULL, 'Consommation', -1500, 'Débit acier XC38 commande urgente', '2026-05-06 10:45:00', 'Sébastien Cousin'),
(47, 16, NULL, 'Ajout', 3000, 'Réception barre cuivre Cu-ETP', '2026-05-08 13:20:00', 'Sébastien Cousin'),
(48, 21, NULL, 'Consommation', -700, 'Usinage PA66 boîtier plastique', '2026-05-09 15:00:00', 'Sébastien Cousin'),
(49, 13, NULL, 'Consommation', -500, 'Tournage inox 310S', '2026-05-11 09:30:00', 'Sébastien Cousin'),
(50, 4, NULL, 'Mise au rebut', -400, 'Chute laiton CuZn39 inutilisable', '2026-05-13 14:00:00', 'Sébastien Cousin'),
(51, 22, NULL, 'Ajout', 1500, 'Réception plaque PEEK', '2026-05-15 08:45:00', 'Sébastien Cousin'),
(52, 11, NULL, 'Consommation', -800, 'Fraisage acier XC100 moule', '2026-05-17 11:00:00', 'Sébastien Cousin'),
(53, 17, NULL, 'Consommation', -300, 'Débit cuivre Cu-DHP connecteur', '2026-05-20 16:30:00', 'Sébastien Cousin'),
(54, 24, NULL, 'Ajout', 1200, 'Réception prisme fibre verre', '2026-05-22 10:00:00', 'Sébastien Cousin'),
(55, 9, NULL, 'Ajout', 6000, 'Réception barre acier 42CrMo4', '2026-05-05 07:30:00', 'Arnaud Confrère'),
(56, 1, NULL, 'Consommation', -600, 'Tournage alu 6060 pièce série', '2026-05-06 09:00:00', 'Arnaud Confrère'),
(57, 18, NULL, 'Consommation', -400, 'Usinage titane TA6V bride aéro', '2026-05-08 14:30:00', 'Arnaud Confrère'),
(58, 15, NULL, 'Ajout', 1500, 'Réception plaque laiton CuZn28', '2026-05-09 08:00:00', 'Arnaud Confrère'),
(59, 20, NULL, 'Consommation', -600, 'Tournage POM-C bague guidage', '2026-05-12 13:45:00', 'Arnaud Confrère'),
(60, 7, NULL, 'Consommation', -1200, 'Fraisage alu 7075 pièce structurelle', '2026-05-14 10:00:00', 'Arnaud Confrère'),
(61, 3, NULL, 'Mise au rebut', -300, 'Chute inox 316L oxydée', '2026-05-15 16:00:00', 'Arnaud Confrère'),
(62, 12, NULL, 'Ajout', 6000, 'Réception barre inox 304L', '2026-05-18 09:15:00', 'Arnaud Confrère'),
(63, 23, NULL, 'Consommation', -400, 'Découpe plaque carbone prototype', '2026-05-21 11:30:00', 'Arnaud Confrère'),
(64, 16, NULL, 'Consommation', -500, 'Débit cuivre Cu-ETP pièce contact', '2026-05-24 14:45:00', 'Arnaud Confrère'),
(65, 2, NULL, 'Ajout', 3000, 'Réception prisme acier XC38', '2026-05-05 08:00:00', 'Daniel Confrère'),
(66, 11, NULL, 'Consommation', -700, 'Fraisage XC100 outillage', '2026-05-07 10:30:00', 'Daniel Confrère'),
(67, 4, NULL, 'Consommation', -300, 'Tournage laiton CuZn39 bague', '2026-05-09 13:00:00', 'Daniel Confrère'),
(68, 19, NULL, 'Ajout', 3000, 'Réception prisme titane T40', '2026-05-11 07:45:00', 'Daniel Confrère'),
(69, 22, NULL, 'Consommation', -600, 'Usinage PEEK pièce médicale', '2026-05-13 15:30:00', 'Daniel Confrère'),
(70, 8, NULL, 'Consommation', -800, 'Débit plaque alu 2017A gabarit', '2026-05-16 09:00:00', 'Daniel Confrère'),
(71, 13, NULL, 'Ajout', 3000, 'Réception prisme inox 310S', '2026-05-18 14:00:00', 'Daniel Confrère'),
(72, 21, NULL, 'Consommation', -400, 'Tournage PA66 pièce robotique', '2026-05-20 10:45:00', 'Daniel Confrère'),
(73, 14, NULL, 'Consommation', -600, 'Débit laiton CuZn37 visserie', '2026-05-22 13:00:00', 'Daniel Confrère'),
(74, 24, NULL, 'Mise au rebut', -300, 'Chute fibre verre trop courte', '2026-05-25 16:15:00', 'Daniel Confrère'),
(75, 1, NULL, 'Ajout', 5000, 'Réception barre alu 6060 dia50', '2026-05-06 08:00:00', 'Charlie'),
(76, 9, NULL, 'Consommation', -900, 'Tournage acier 42CrMo4 arbre', '2026-05-07 11:00:00', 'Charlie'),
(77, 20, NULL, 'Ajout', 2000, 'Réception barre POM-C dia80', '2026-05-10 13:30:00', 'Charlie'),
(78, 12, NULL, 'Consommation', -700, 'Usinage inox 304L flasque', '2026-05-12 09:45:00', 'Charlie'),
(79, 7, NULL, 'Consommation', -1500, 'Fraisage alu 7075 châssis', '2026-05-14 14:00:00', 'Charlie'),
(80, 17, NULL, 'Ajout', 2000, 'Réception prisme cuivre Cu-DHP', '2026-05-16 08:30:00', 'Charlie'),
(81, 22, NULL, 'Consommation', -500, 'Découpe PEEK pièce haute temp.', '2026-05-19 10:00:00', 'Charlie'),
(82, 10, NULL, 'Consommation', -600, 'Débit plaque acier S235 structure', '2026-05-21 15:15:00', 'Charlie'),
(83, 18, NULL, 'Mise au rebut', -200, 'Chute titane TA6V inutilisable', '2026-05-23 13:00:00', 'Charlie'),
(84, 23, NULL, 'Ajout', 1000, 'Réception plaque fibre carbone', '2026-05-26 09:30:00', 'Charlie'),
(85, 9, NULL, 'Consommation', -700, 'Tournage acier 42CrMo4 axe moteur', '2026-05-28 08:30:00', 'Sylvain Prudhomme'),
(86, 14, NULL, 'Ajout', 2500, 'Réception barre laiton CuZn37', '2026-05-29 13:00:00', 'Sylvain Prudhomme'),
(87, 20, NULL, 'Consommation', -400, 'Fraisage POM-C bague de guidage', '2026-06-02 10:45:00', 'Sylvain Prudhomme'),
(88, 7, NULL, 'Consommation', -900, 'Fraisage alu 7075 pièce structurelle', '2026-05-28 09:15:00', 'Marc-Antoine Pignon'),
(89, 12, NULL, 'Ajout', 6000, 'Réception barre inox 304L dia30', '2026-05-30 14:30:00', 'Marc-Antoine Pignon'),
(90, 21, NULL, 'Consommation', -500, 'Usinage PA66 support plastique', '2026-06-01 11:00:00', 'Marc-Antoine Pignon'),
(91, 10, NULL, 'Mise au rebut', -300, 'Chute plaque acier S235 inutilisable', '2026-06-02 16:00:00', 'Marc-Antoine Pignon'),
(92, 16, NULL, 'Ajout', 3000, 'Réception barre cuivre Cu-ETP', '2026-05-29 08:00:00', 'Olivier Doyer'),
(93, 11, NULL, 'Consommation', -600, 'Fraisage acier XC100 outillage', '2026-05-31 13:45:00', 'Olivier Doyer'),
(94, 22, NULL, 'Consommation', -400, 'Découpe PEEK pièce haute température', '2026-06-02 09:30:00', 'Olivier Doyer'),
(95, 18, NULL, 'Consommation', -300, 'Usinage titane TA6V bride aéro', '2026-05-28 11:30:00', 'Ludovic Bucamp'),
(96, 8, NULL, 'Ajout', 3000, 'Réception plaque alu 2017A', '2026-05-30 08:45:00', 'Ludovic Bucamp'),
(97, 13, NULL, 'Consommation', -500, 'Tournage inox 310S pièce série', '2026-06-01 14:15:00', 'Ludovic Bucamp'),
(98, 23, NULL, 'Mise au rebut', -200, 'Chute fibre carbone trop courte', '2026-06-02 15:30:00', 'Ludovic Bucamp');

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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `matieres`
--

INSERT INTO `matieres` (`id`, `nom`, `type_forme`, `seuil_alerte_longueur`, `date_creation`, `code`) VALUES
(1, 'Aluminium', 'Cylindrique', 5000, '2026-05-27 16:06:01', '6060 (T6)'),
(2, 'Acier', 'Prisme', 3000, '2026-05-27 16:06:01', 'XC38 (C35)'),
(3, 'Inox', 'Cylindrique', 4000, '2026-05-27 16:06:01', '316L'),
(4, 'Laiton', 'Cylindrique', 2000, '2026-05-27 16:06:01', 'CuZn39Pb3'),
(5, 'Inox', 'Plaque', 1200, '2026-06-03 09:45:17', '17-4PH'),
(6, 'Inox', 'Prisme', 1200, '2026-06-03 12:03:15', '17-4PH'),
(7, 'Aluminium', 'Prisme', 4000, '2026-06-03 12:55:11', '7075 (T6)'),
(8, 'Aluminium', 'Plaque', 3000, '2026-06-03 12:55:11', '2017A'),
(9, 'Acier', 'Cylindrique', 5000, '2026-06-03 12:55:11', '42CrMo4'),
(10, 'Acier', 'Plaque', 2000, '2026-06-03 12:55:11', 'S235'),
(11, 'Acier', 'Prisme', 3500, '2026-06-03 12:55:11', 'XC100'),
(12, 'Inox', 'Cylindrique', 4000, '2026-06-03 12:55:11', '304L'),
(13, 'Inox', 'Prisme', 3000, '2026-06-03 12:55:11', '310S'),
(14, 'Laiton', 'Prisme', 2500, '2026-06-03 12:55:11', 'CuZn37'),
(15, 'Laiton', 'Plaque', 1500, '2026-06-03 12:55:11', 'CuZn28'),
(16, 'Cuivre', 'Cylindrique', 3000, '2026-06-03 12:55:11', 'Cu-ETP'),
(17, 'Cuivre', 'Prisme', 2000, '2026-06-03 12:55:11', 'Cu-DHP'),
(18, 'Titane', 'Cylindrique', 4000, '2026-06-03 12:55:11', 'TA6V'),
(19, 'Titane', 'Prisme', 3000, '2026-06-03 12:55:11', 'T40'),
(20, 'Plastique', 'Cylindrique', 2000, '2026-06-03 12:55:11', 'POM-C'),
(21, 'Plastique', 'Prisme', 2500, '2026-06-03 12:55:11', 'PA66'),
(22, 'Plastique', 'Plaque', 1500, '2026-06-03 12:55:11', 'PEEK'),
(23, 'Composite', 'Plaque', 1000, '2026-06-03 12:55:11', 'Fibre Carbone'),
(24, 'Composite', 'Prisme', 1200, '2026-06-03 12:55:11', 'Fibre Verre');

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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `stock_unitaire`
--

INSERT INTO `stock_unitaire` (`id`, `matiere_id`, `longueur`, `d_x`, `d_y`, `diametre`, `statut`, `date_entree`, `date_modification`) VALUES
(1, 1, 3000, NULL, NULL, 50, 'Neuf', '2026-05-27 16:06:01', '2026-05-27 16:06:01'),
(2, 1, 2500, NULL, NULL, 50, 'Entamé', '2026-05-27 16:06:01', '2026-05-27 16:06:01'),
(4, 2, 2000, 100, 50, NULL, 'Entamé', '2026-05-27 16:06:01', '2026-05-27 16:06:01'),
(5, 2, 300, 60, 60, NULL, 'Chute', '2026-05-27 16:06:01', '2026-05-27 16:06:01'),
(6, 3, 0, NULL, NULL, 20, 'Hors-stock', '2026-05-27 16:06:01', '2026-06-01 10:38:53'),
(8, 4, 400, NULL, NULL, 40, 'Chute', '2026-05-27 16:06:01', '2026-05-27 16:06:01'),
(9, 5, 6000, NULL, NULL, 125, 'Entamé', '2026-06-03 09:45:17', '2026-06-03 09:45:17'),
(10, 6, 6000, NULL, NULL, 125, 'Entamé', '2026-06-03 12:03:15', '2026-06-03 12:03:15'),
(11, 7, 4000, 80, 40, NULL, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(12, 7, 2800, 80, 40, NULL, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(13, 7, 350, 80, 40, NULL, 'Chute', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(14, 8, 3000, 200, 20, NULL, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(15, 8, 1500, 200, 20, NULL, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(16, 9, 6000, NULL, NULL, 60, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(17, 9, 4200, NULL, NULL, 60, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(18, 9, 800, NULL, NULL, 40, 'Chute', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(19, 10, 2000, 300, 15, NULL, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(20, 10, 900, 300, 15, NULL, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(21, 11, 3500, 50, 50, NULL, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(22, 11, 1200, 50, 50, NULL, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(23, 12, 6000, NULL, NULL, 30, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(24, 12, 3200, NULL, NULL, 30, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(25, 12, 400, NULL, NULL, 20, 'Chute', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(26, 13, 3000, 60, 40, NULL, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(27, 13, 700, 60, 40, NULL, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(28, 14, 2500, 30, 30, NULL, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(29, 14, 1800, 30, 30, NULL, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(30, 14, 250, 30, 30, NULL, 'Chute', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(31, 15, 1500, 150, 10, NULL, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(32, 16, 3000, NULL, NULL, 25, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(33, 16, 1600, NULL, NULL, 25, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(34, 17, 2000, 40, 40, NULL, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(35, 18, 4000, NULL, NULL, 50, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(36, 18, 2200, NULL, NULL, 35, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(37, 19, 3000, 45, 45, NULL, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(38, 20, 2000, NULL, NULL, 80, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(39, 20, 1100, NULL, NULL, 60, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(40, 20, 300, NULL, NULL, 40, 'Chute', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(41, 21, 2500, 100, 50, NULL, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(42, 21, 900, 100, 50, NULL, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(43, 22, 1500, 200, 15, NULL, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(44, 22, 400, 200, 15, NULL, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(45, 23, 1000, 500, 5, NULL, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(46, 23, 600, 500, 5, NULL, 'Entamé', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(47, 24, 1200, 80, 30, NULL, 'Neuf', '2026-06-03 12:55:11', '2026-06-03 12:55:11'),
(48, 24, 500, 80, 30, NULL, 'Chute', '2026-06-03 12:55:11', '2026-06-03 12:55:11');

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
