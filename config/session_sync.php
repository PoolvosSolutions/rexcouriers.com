<?php
// config/session_sync.php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// 🔥 Basic validation to ensure critical data is present
if (empty($_POST['userId']) || empty($_POST['userType'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required user data.']);
    exit;
}

// 🔥 Store user data in session
$_SESSION['user'] = [
    'userId'       => $_POST['userId']       ?? '',
    'email'        => $_POST['email']        ?? '',
    'fullName'     => $_POST['fullName']     ?? '',
    'userType'     => $_POST['userType']     ?? '',
    'userStatus'   => $_POST['userStatus']   ?? '',
    'userCode'     => $_POST['userCode']     ?? '',
    'merchantCode' => $_POST['merchantCode'] ?? '',
    'merchantName' => $_POST['merchantName'] ?? '',
    'branchCode'   => $_POST['branchCode']   ?? '',
    'branchName'   => $_POST['branchName']   ?? ''
];

// Optional: Log for debugging (uncomment if you need to troubleshoot)
// error_log("✅ Rexcouris Session Synced for: " . $_SESSION['user']['email']);

echo json_encode([
    'success' => true,
    'message' => 'Session synced successfully',
    'user'    => $_SESSION['user']
]);