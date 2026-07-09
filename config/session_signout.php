<?php
// config/signout.php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 🔥 Unset and destroy session
$_SESSION = [];
session_destroy();

// 🔥 Handle AJAX vs Direct Link
if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    // If called via AJAX, return JSON
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
} else {
    // If accessed directly, redirect to home.php
    header("Location: ../home.php?_=" . time());
    exit;
}