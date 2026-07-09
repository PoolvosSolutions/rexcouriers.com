<?php
// api/send-password-reset.php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

// 🔒 Rate Limiting: Max 3 requests per 5 minutes to prevent abuse
if (isset($_SESSION['last_pw_reset_request'])) {
    $lastTime = $_SESSION['last_pw_reset_request'];
    if (time() - $lastTime < 300) {
        echo json_encode(['success' => false, 'message' => 'Please wait a few minutes before requesting another reset.']);
        exit;
    }
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Valid email address is required.']);
    exit;
}

require_once __DIR__ . '/../config/config.php';
$apiKey = $firebaseConfig['apiKey'];
$continueUrl = $data['continueUrl'] ?? (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]/index.php";

$url = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key={$apiKey}";
$payload = [
    'requestType' => 'PASSWORD_RESET',
    'email' => $email,
    'continueUrl' => $continueUrl
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$_SESSION['last_pw_reset_request'] = time();

$result = json_decode($response, true);
if ($httpCode !== 200 || isset($result['error'])) {
    $errorMsg = $result['error']['message'] ?? 'Failed to send reset email.';
    $errorMap = [
        'EMAIL_NOT_FOUND' => 'No account exists with this email address.',
        'INVALID_EMAIL' => 'Invalid email format.',
        'MISSING_EMAIL' => 'Email is required.'
    ];
    echo json_encode(['success' => false, 'message' => $errorMap[$errorMsg] ?? $errorMsg]);
} else {
    echo json_encode(['success' => true, 'message' => 'Password reset email sent successfully.']);
}

