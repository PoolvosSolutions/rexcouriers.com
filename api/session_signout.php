<?php


// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

// Check if this is a sign-out request
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['signout'])) {
  // Unset all session variables
  session_unset();
  // Destroy the session
  session_destroy();
  // Prevent session fixation by regenerating ID (optional, for extra security)
  session_regenerate_id(true);
  // Redirect to index.php
  header("Location: ../index.php");
  exit;
} else {
  // If accessed directly without signout param, redirect to index
  header("Location: ../index.php");
  exit;
}
?>