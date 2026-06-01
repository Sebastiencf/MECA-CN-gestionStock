<?php
// config.php

    $host = '127.0.0.1';
    $db   = 'meca-cn-stocks';
    $user = 'root';
    $pass = ''; // Vide par défaut sur Wamp/Laragon, 'root' sur Mac/MAMP
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Active les alertes si le SQL bug
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Renvoie les données sous forme de tableau associatif
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        // Création de la connexion globale
        $pdo = new PDO($dsn, $user, $pass, $options);
    } catch (\PDOException $e) {
        // Si la connexion échoue, on arrête tout et on affiche l'erreur
        die("Erreur de connexion à la base de données : " . $e->getMessage());
    }