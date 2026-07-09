<?php
// api/signout.php
// 🔥 Complete sign-out - destroys session and clears all traces

// Prevent caching
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: 0");
header("Content-Type: application/json");

// Start session if not started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 🔥 Step 1: Clear all session variables
$_SESSION = array();

// 🔥 Step 2: Delete session cookie (if it exists)
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// 🔥 Step 3: Destroy the session completely
session_destroy();

// 🔥 Step 4: Start a fresh empty session (prevents session fixation)
session_start();
session_regenerate_id(true);

// 🔥 Step 5: Clear any output buffers
if (ob_get_level()) ob_clean();

// 🔥 Success response
echo json_encode([
    'success' => true,
    'message' => 'Signed out successfully'
]);
exit;