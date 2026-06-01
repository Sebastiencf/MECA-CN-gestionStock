# 📦 Système de Gestion des Stocks – MECA-CN
Ce projet est une application web locale de gestion des stocks de matières premières (bruts et chutes), spécialement conçue pour les contraintes d'un atelier de mécanique de précision (flux tendus, modification des dimensions en cours de production).



<br><br><br><br><br>



# 🛠️ Spécifications Fonctionnelles & Ergonomie
Gestion au morceau (Unitaire) : Contrairement à un inventaire classique, l'application suit chaque barre ou bloc physiquement présent sur l'étagère pour refléter l'évolution de ses dimensions (débit).

Alerte à la Longueur Totale : Les alertes de stock faible ne se basent pas sur le nombre de morceaux, mais sur la somme cumulée des longueurs disponibles pour une nuance donnée. Cela évite les fausses alertes dues à la présence de petites chutes.

Gestion du Flux Tendu (Urgence) : Un bouton "Arrivée Directe" permet d'enregistrer une matière reçue du fournisseur et immédiatement consommée sur une machine, sans l'obliger à transiter virtuellement par le stock.

Traçabilité passive (Historique) : Pas de validation Admin bloquante pour l'atelier. Les opérateurs saisissent directement leurs mouvements, et l'administrateur dispose d'un fil d'actualité complet (logs) pour contrôler les actions a posteriori.

Déploiement Atelier : Accès centralisé via une borne fixe ou tablette tactile avec douchette de scan USB, située directement dans la salle de stockage (évite l'utilisation et la distraction des téléphones personnels).



<br><br><br><br><br>



# 💾 Architecture de la Base de Données
Le système repose sur un modèle relationnel à trois tables (Moteur InnoDB) pour dissocier le catalogue général des morceaux réels et conserver l'historique.

**Script SQL de Création des Tables**
```sql
SQL
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 1. Suppression des anciennes tables
DROP TABLE IF EXISTS `historique_stock`;
DROP TABLE IF EXISTS `stock_unitaire`;
DROP TABLE IF EXISTS `matieres`;

-- 2. Table `matieres` (Le catalogue fixe)
CREATE TABLE IF NOT EXISTS `matieres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `type_forme` varchar(50) NOT NULL, -- 'Cylindrique', 'Prisme'
  `seuil_alerte_longueur` int DEFAULT '0', -- En millimètres (mm)
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Table `stock_unitaire` (Les morceaux physiques à l'atelier)
CREATE TABLE IF NOT EXISTS `stock_unitaire` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matiere_id` int NOT NULL,
  `longueur` int NOT NULL DEFAULT '0', -- En millimètres (mm)
  `d_x` int DEFAULT NULL, -- Largeur (si Prisme)
  `d_y` int DEFAULT NULL, -- Épaisseur (si Prisme)
  `diametre` int DEFAULT NULL, -- Diamètre (si Cylindrique)
  `statut` varchar(50) DEFAULT 'Neuf', -- 'Neuf', 'Entamé', 'Chute'
  `date_entree` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_matiere_id` (`matiere_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. Table `historique_stock` (Le fil d'actualité pour l'Admin)
CREATE TABLE IF NOT EXISTS `historique_stock` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matiere_id` int NOT NULL,
  `stock_unitaire_id` int DEFAULT NULL,
  `action` varchar(50) NOT NULL, -- 'Ajout', 'Consommation', 'Correction', 'Mise au rebut'
  `valeur_modification` int NOT NULL, -- ex: -500 ou +3000 (en mm)
  `commentaire` text,
  `date_action` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_hist_matiere` (`matiere_id`),
  KEY `fk_hist_stock` (`stock_unitaire_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 5. Contraintes d'intégrité (Clés étrangères)
ALTER TABLE `stock_unitaire`
  ADD CONSTRAINT `fk_stock_matiere` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `historique_stock`
  ADD CONSTRAINT `fk_historique_matiere` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_historique_stock` FOREIGN KEY (`stock_unitaire_id`) REFERENCES `stock_unitaire` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
Jeu de Données de Test (Scénarios Réels)
SQL
START TRANSACTION;

-- Insertion du catalogue de nuances
INSERT INTO `matieres` (`id`, `nom`, `type_forme`, `seuil_alerte_longueur`) VALUES
(1, 'Aluminium 6060 (T6)', 'Cylindrique', 5000),
(2, 'Acier XC38 (C35)', 'Prisme', 3000),
(3, 'Inox 316L', 'Cylindrique', 4000),
(4, 'Laiton CuZn39Pb3', 'Cylindrique', 2000);

-- Insertion du stock physique initial
INSERT INTO `stock_unitaire` (`id`, `matiere_id`, `longueur`, `d_x`, `d_y`, `diametre`, `statut`) VALUES
(1, 1, 3000, NULL, NULL, 50, 'Neuf'),      
(2, 1, 2500, NULL, NULL, 50, 'Entamé'),   
(3, 1, 700, NULL, NULL, 30, 'Chute'),      
(4, 2, 2000, 100, 50, NULL, 'Entamé'),    
(5, 2, 300, 60, 60, NULL, 'Chute'),       
(6, 3, 4000, NULL, NULL, 20, 'Neuf'),     
(7, 3, 3500, NULL, NULL, 20, 'Entamé'),   
(8, 4, 400, NULL, NULL, 40, 'Chute');     

-- Simulation de l'historique des mouvements
INSERT INTO `historique_stock` (`matiere_id`, `stock_unitaire_id`, `action`, `valeur_modification`, `commentaire`) VALUES
(1, 1, 'Ajout', 3000, 'Réception fournisseur - Commande #4521'),
(1, 2, 'Consommation', -500, 'Usinage de pièces sur MAZAK I200'),
(2, NULL, 'Consommation', -2000, 'Flux tendu : Reçu et débité directement pour l''Acier XC38 (Urgence client)'),
(4, NULL, 'Mise au rebut', -400, 'Chute de laiton devenue trop courte pour être bridée');

COMMIT;
```


<br><br><br><br><br>



# 🚀 Architecture Technique & Déploiement Local
Technologies retenues
Backend & Base de données : PHP 8.x / MySQL (Moteur InnoDB). Choisi pour sa stabilité industrielle en PME, son absence de maintenance serveur, et sa légèreté.

Frontend : HTML5 / CSS3 / JavaScript (ou architecture API hybride) pour une interface moderne et dynamique sur tablette.

Processus de Déploiement
[ Ton PC de Code ] --------( Copie Réseau / Clé USB )--------> [ Serveur MECA-CN ]
  (Développement)                                                (Production Locale)
  - Laragon / Wamp                                               - XAMPP / Wamp
  - Base 'meca-cn-stocks'                                        - Import de la Base
Développement (Sur ton PC) : Utilisation d'un environnement comme Laragon ou WampServer. Le code est centralisé dans un dossier de travail (/meca-stock/).

Préparation du serveur de MECA-CN : Installation d'un package serveur (ex: WampServer ou XAMPP) directement sur l'ordinateur de partage de fichiers de l'entreprise. Importation du script SQL via phpMyAdmin.

Mise en production : Transfert par clé USB ou réseau du dossier contenant les fichiers PHP vers le répertoire racine (www ou htdocs) du serveur de l'entreprise. Ajustement des identifiants dans le fichier de configuration de la base de données.

Accès Client : Les tablettes et postes de l'atelier accèdent à l'application via le réseau local en tapant l'adresse IP fixe du serveur dans leur navigateur (Exemple : http://192.168.1.50/meca-stock/). Tout fonctionne en circuit fermé, sans dépendance à une connexion Internet.



<br><br><br><br><br>



## 📐 Gestion des Formes et Dimensions (Types de Matières)

Afin de correspondre à la réalité de l'atelier de MECA-CN, le système distingue plusieurs types de profils métalliques. L'interface de l'application doit adapter dynamiquement les champs de saisie de dimensions selon le type sélectionné pour simplifier la tâche des opérateurs.



### 1. Liste des Types de Formes (`type_forme`)

* **Barre ronde :** Cylindre plein utilisé majoritairement sur les tours CNC (Mazak Nexus, Tsugami).
* **Tube :** Profilé cylindrique creux (ébauche creuse).
* **Méplat / Bloc :** Barre rectangulaire pleine, base standard pour les centres d'usinage (Brother, Variaxis).
* **Carré :** Barre pleine de section carrée.
* **Six pans :** Profilé hexagonal, très utilisé pour le décolletage ou les pièces d'assemblage.

---

### 2. Correspondance des Dimensions et de la Base de Données

Le tableau suivant sert de règle de gestion pour l'affichage des formulaires (Front-End) et l'enregistrement en Base de Données (Back-End) :

| Type de Forme | Libellé des champs à l'écran | Correspondance Colonnes SQL |
| :--- | :--- | :--- |
| **Barre ronde** | Diamètre (mm) <br> Longueur (mm) | `diametre` <br> `longueur` |
| **Tube** | Diamètre Extérieur (mm) <br> Épaisseur (mm) <br> Longueur (mm) | `diametre` <br> `d_x` *(épaisseur)* <br> `longueur` |
| **Méplat / Bloc** | Largeur (mm) <br> Épaisseur (mm) <br> Longueur (mm) | `d_x` <br> `d_y` <br> `longueur` |
| **Carré** | Section / Côté (mm) <br> Longueur (mm) | `d_x` <br> `longueur` |
| **Six pans** | Entreplat / Clé (mm) <br> Longueur (mm) | `diametre` <br> `longueur` |

---

### 3. Logique Front-End suggérée

Lorsqu'un employé ajoute ou modifie un morceau sur la tablette :
1. Il sélectionne le `type_forme` via un menu déroulant (`<select>`).
2. Un script JavaScript (`addEventListener('change')`) masque les champs inutiles et renomme les placeholders des champs actifs (ex: renommer `d_x` en "Largeur" pour un méplat, ou en "Épaisseur" pour un tube).
3. Le champ `longueur` reste **toujours visible et obligatoire**, car il sert de base au calcul de l'alerte de stock global.



<br><br><br><br><br>


## 🔐 Authentification et Accès Réseau (Séparation Atelier / Bureau)

Le système étant déployé sur le réseau local de MECA-CN, l'accès aux fonctionnalités est segmenté automatiquement en fonction de l'adresse IP de l'appareil qui consulte l'application. Cela évite l'utilisation de mots de passe complexes et sécurise les droits d'administration.

### 1. Configuration Réseau (IP Fixes)
Pour que le système fonctionne, les deux appareils principaux doivent posséder une adresse IP statique sur le routeur de l'entreprise :
* **Tablette Salle de Stockage :** `192.168.1.20` (Interface Opérateur)
* **PC Bureau du Patron :** `192.168.1.10` (Interface Administrateur / Patron)

---

### 2. Logique d'identification automatique en PHP

Le script de routage vérifie l'origine de la requête (`$_SERVER['REMOTE_ADDR']`) pour adapter les droits :

```php
// Exemple de logique de routage
$ip_client = $_SERVER['REMOTE_ADDR'];
$ip_patron = '192.168.1.10';
$ip_tablette = '192.168.1.20';

if ($ip_client === $ip_patron) {
    $role_utilisateur = 'ADMIN';
    // Connexion automatique du patron avec accès complet
} elseif ($ip_client === $ip_tablette) {
    $role_utilisateur = 'OPERATEUR';
    // Redirection vers le trombinoscope / scan de badge pour l'atelier
} else {
    $role_utilisateur = 'INVITE';
    // Accès restreint ou consultation seule
}
```




### 3. Matrice des Rôles par Appareil

| Fonctionnalité | Tablette Atelier (192.168.1.20) | PC Bureau Patron (192.168.1.10) | 
| :--- | :--- | :--- |
| Sélection de l'opérateur (Trombinoscope) | ✅ Obligatoire | ❌ Non (Identifié comme Patron) | 
| Consulter l'état des stocks | ✅ Oui | ✅ Oui | 
Débiter / Consommer une matière | ✅ Oui | ✅ Oui | 
| Enregistrer un flux tendu (Urgence) | ✅ Oui | ✅ Oui | 
Consulter le fil d'actualité (Logs) | ❌ Masqué | ✅ Oui | 
Modifier les seuils d'alerte | ❌ Masqué | ✅ Oui | 
| Ajouter/Supprimer du catalogue | ❌ Masqué | ✅ Oui |



<br><br><br><br><br>



## 🎨 Spécifications de l'Interface Graphique (UI/UX Admin)

Afin d'assurer la cohérence visuelle développée dans les maquettes, l'application respecte les règles d'ergonomie et les composants d'interface suivants :

### 1. Structure de Navigation Globale (Layout)
L'interface d'administration utilise un gabarit à deux sections persistantes :
* **Sidebar Latérale (Gauche) :** Menu fixe permettant la navigation un clic entre l'Accueil (Tableau de bord), la Gestion du Catalogue, et l'Historique des mouvements.
* **Zone de Contenu Principal (Centre) :** Zone dynamique où s'affichent les tableaux et les formulaires, configurée avec un thème sombre (Dark Mode industriel) pour réduire la fatigue visuelle.

### 2. Formulaires à Double Colonne (Composant Réactif)
Les pages d'insertion (`Ajout.png`) et d'édition (`Modification.png`) adoptent une disposition spécifique pour sécuriser la saisie :
* **Colonne de gauche :** Champs de saisie classiques (inputs, selects).
* **Volet Récapitulatif (Droite) :** Panneau vertical affichant dynamiquement la synthèse textuelle de la matière en cours de configuration. Ce panneau se met à jour en temps réel via JavaScript à chaque modification des champs de gauche.

### 3. Code Couleur de l'État des Stocks
Le tableau de bord principal applique une mise en forme conditionnelle basée sur la colonne `etat_stock` calculée par la base de données :
* 🟢 **Statut OK :** Affichage standard/neutre (La quantité totale est supérieure au seuil).
* 🔴 **Statut Alerte :** Mise en évidence visuelle (badge ou texte de couleur contrastée) pour indiquer que le seuil de sécurité est franchi, ou bien que le stock est vide, et qu'une commande fournisseur est requise.

### 4. Composants d'Action Rapide et Gestion du Catalogue

* **Fenêtre Modale de Débit Bureau :** Depuis le tableau de bord d'accueil, l'Admin peut cliquer sur une ligne de stock (hors bouton d'édition complète) pour ouvrir une fenêtre modale de débit rapide. Ce composant permet de soustraire une longueur (mm) et d'ajouter un commentaire lié à une commande client en un clic, sans rechargement de page.
* **Page de Configuration du Catalogue (`Matières`) :** Accessibles via la sidebar, cet écran liste uniquement les références de nuances (sans le détail des morceaux physiques) et permet à l'Admin de modifier directement dans le tableau le `seuil_alerte_longueur` global de chaque matière.


### 5. Flux d'Interaction Atelier (Scan QR Code)

L'interaction sur la tablette suit un parcours linéaire et sécurisé en 5 étapes :
1. **Identification :** Choix de l'opérateur via le trombinoscope visuel (`choix.pdf`).
2. **Scan :** Prise en compte du QR Code de la matière (sélection automatique de la nuance et du profil).
3. **Action :** Choix de la nature du mouvement via deux larges boutons : `Consommation` (Soustraction) ou `Ajout` (Entrée de stock / Chute).
4. **Saisie Numérique :** Ouverture d'un pavé numérique virtuel dédié (style calculatrice) pour renseigner la valeur en millimètres, évitant les erreurs de frappe sur clavier classique.
5. **Validation & Feedback :** Écran de confirmation affichant la nouvelle longueur calculée du morceau, suivi d'une déconnexion automatique vers l'écran d'accueil après 3 secondes.