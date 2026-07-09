<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Validate required fields
    $requiredFields = ['userId', 'email', 'userStatus'];
    foreach ($requiredFields as $field) {
        if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
            echo json_encode(['status' => 'error', 'message' => 'Missing required field: ' . $field]);
            exit;
        }
    }

    $userData = [
        'userId'     => $_POST['userId'] ?? '',
        'email'      => $_POST['email'] ?? '',
        'fullName'   => $_POST['Name'] ?? '',
        'userType'   => $_POST['userType'] ?? '',
        'department' => $_POST['department'] ?? '',
        'userStatus' => $_POST['userStatus'] ?? ''
    ];

    // Store in PHP session
    $_SESSION['user'] = $userData;

    // Correct json_encode usage
    echo json_encode([
        'status'  => 'success',
        'message' => 'Session synced',
        'data'    => $_SESSION['user'],
        'sid'     => session_id()
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
}

?>
