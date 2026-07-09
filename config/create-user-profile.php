
<?php
// api/create-user-profile.php
header('Content-Type: application/json');
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$userId = $data['userId'] ?? '';
$email = $data['email'] ?? '';
$fullName = $data['fullName'] ?? '';
$userType = $data['userType'] ?? 'Customer';
$userStatus = $data['userStatus'] ?? 'Pending';

if (empty($userId) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

// 🔥 Generate SHA-256 hashes
$emailHash = hash('sha256', strtolower(trim($email)));

// Load Firebase configuration
require_once __DIR__ . '/../config/config.php';
$databaseURL = $firebaseConfig['databaseURL'];
$databaseSecret = $firebaseConfig['databaseSecret'] ?? '';

// Prepare user data
$now = new DateTime('now', new DateTimeZone('Asia/Karachi'));
$dateTime = $now->format('Y-m-d H:i:s');
$date = $now->format('Y-m-d');

$userData = [
    'userId' => $userId,
    'email' => $email,
    'emailHash' => $emailHash,
    'fullName' => $fullName,
    'userType' => $userType,
    'userStatus' => $userStatus,
    'isVerified' => false,
    'createdBy' => 'self',
    'profileImage' => 'assets/img/userimg/udefault.png',
    'date' => $date,
    'dateTime' => $dateTime,
    'createdAt' => $dateTime
];

// 🔥 Save user profile to Firebase Realtime DB
$userUrl = "{$databaseURL}/users/{$userId}.json?auth={$databaseSecret}";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $userUrl);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($userData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_exec($ch);
curl_close($ch);

// 🔥 Create email index
$emailIndexData = [
    'uid' => $userId,
    'userType' => $userType,
    'userCode' => '',  // Will be set when user verifies email
    'createdAt' => $dateTime
];

$emailIndexUrl = "{$databaseURL}/userEmailIndex/{$emailHash}.json?auth={$databaseSecret}";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $emailIndexUrl);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($emailIndexData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_exec($ch);
curl_close($ch);

echo json_encode([
    'success' => true,
    'message' => 'User profile created successfully.'
]);

