<?php
// api/create-firebase-user.php
header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

// Get raw POST data
$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$userData = $data['userData'] ?? [];  // 🔥 NEW: Full user profile data

// Validation
if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
    exit;
}

if (strlen($password) < 8) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters.']);
    exit;
}

// 🔥 Generate SHA-256 hashes (works on HTTP and HTTPS)
$emailHash = hash('sha256', strtolower(trim($email)));
$phoneHash = !empty($userData['phone']) ? hash('sha256', preg_replace('/\D/', '', $userData['phone'])) : null;

// Load Firebase configuration
require_once __DIR__ . '/../config/config.php';
$apiKey = $firebaseConfig['apiKey'];
$databaseURL = $firebaseConfig['databaseURL'];

// 🔥 Step 1: Check duplicate email using hash
$emailCheckUrl = "{$databaseURL}/userEmailIndex/{$emailHash}.json";
$emailCheck = json_decode(file_get_contents($emailCheckUrl), true);

if ($emailCheck) {
    echo json_encode(['success' => false, 'message' => 'This email is already registered.']);
    exit;
}

// 🔥 Step 2: Check duplicate phone using hash (if provided)
if ($phoneHash) {
    $phoneCheckUrl = "{$databaseURL}/userPhoneIndex/{$phoneHash}.json";
    $phoneCheck = json_decode(file_get_contents($phoneCheckUrl), true);
    
    if ($phoneCheck) {
        echo json_encode(['success' => false, 'message' => 'This phone number is already registered.']);
        exit;
    }
}

// 🔥 Step 3: Create user in Firebase Auth
$authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={$apiKey}";

$payload = [
    'email' => $email,
    'password' => $password,
    'returnSecureToken' => true
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $authUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);

if ($httpCode !== 200 || isset($result['error'])) {
    $errorMsg = $result['error']['message'] ?? 'Failed to create user.';
    
    $errorMap = [
        'EMAIL_EXISTS' => 'This email is already registered.',
        'INVALID_EMAIL' => 'Invalid email format.',
        'WEAK_PASSWORD' => 'Password is too weak. Use at least 8 characters.',
        'OPERATION_NOT_ALLOWED' => 'Email/password sign-up is disabled in Firebase.'
    ];
    
    $friendlyMsg = $errorMap[$errorMsg] ?? $errorMsg;
    
    echo json_encode(['success' => false, 'message' => $friendlyMsg]);
    exit;
}

$uid = $result['localId'];

// 🔥 Step 4: Add hashes to userData
$userData['emailHash'] = $emailHash;
$userData['phoneHash'] = $phoneHash;
$userData['userId'] = $uid;

// 🔥 Step 5: Save user profile to Firebase Realtime DB
$userUrl = "{$databaseURL}/users/{$uid}.json?auth=" . ($firebaseConfig['databaseSecret'] ?? '');
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $userUrl);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_exec($ch);
curl_close($ch);

// 🔥 Step 6: Create email index
$emailIndexData = [
    'uid' => $uid,
    'userType' => $userData['userType'] ?? 'Customer',
    'userCode' => $userData['userCode'] ?? '',
    'createdAt' => $userData['createdAt'] ?? date('Y-m-d H:i:s')
];

$emailIndexUrl = "{$databaseURL}/userEmailIndex/{$emailHash}.json?auth=" . ($firebaseConfig['databaseSecret'] ?? '');
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $emailIndexUrl);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($emailIndexData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_exec($ch);
curl_close($ch);

// 🔥 Step 7: Create phone index (if phone provided)
if ($phoneHash) {
    $phoneIndexData = [
        'uid' => $uid,
        'userType' => $userData['userType'] ?? 'Customer',
        'userCode' => $userData['userCode'] ?? '',
        'createdAt' => $userData['createdAt'] ?? date('Y-m-d H:i:s')
    ];
    
    $phoneIndexUrl = "{$databaseURL}/userPhoneIndex/{$phoneHash}.json?auth=" . ($firebaseConfig['databaseSecret'] ?? '');
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $phoneIndexUrl);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($phoneIndexData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_exec($ch);
    curl_close($ch);
}

// 🔥 Step 8: Create merchant/branch mappings if applicable
if (!empty($userData['merchantCode'])) {
    $merchantUserData = [
        'userCode' => $userData['userCode'] ?? '',
        'fullName' => $userData['fullName'] ?? '',
        'userType' => $userData['userType'] ?? '',
        'branchCode' => $userData['branchCode'] ?? null
    ];
    
    $merchantUserUrl = "{$databaseURL}/merchantUsers/{$userData['merchantCode']}/{$uid}.json?auth=" . ($firebaseConfig['databaseSecret'] ?? '');
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $merchantUserUrl);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($merchantUserData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_exec($ch);
    curl_close($ch);
}

if (!empty($userData['branchCode'])) {
    $branchUserData = [
        'userCode' => $userData['userCode'] ?? '',
        'fullName' => $userData['fullName'] ?? '',
        'userType' => $userData['userType'] ?? ''
    ];
    
    $branchUserUrl = "{$databaseURL}/branchUsers/{$userData['branchCode']}/{$uid}.json?auth=" . ($firebaseConfig['databaseSecret'] ?? '');
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $branchUserUrl);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($branchUserData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_exec($ch);
    curl_close($ch);
}

// Success
echo json_encode([
    'success' => true,
    'uid' => $uid,
    'email' => $email,
    'emailHash' => $emailHash,
    'message' => 'User created successfully.'
]);

