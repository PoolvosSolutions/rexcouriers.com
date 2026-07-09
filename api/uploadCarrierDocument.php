<?php
// api/uploadCarrierDocument.php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$uploadType = $_POST['uploadType'] ?? '';

if (!in_array($uploadType, ['carrier_logo', 'carrier_agreement'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid upload type']);
    exit;
}

if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'File upload error']);
    exit;
}

$file = $_FILES['document'];

// Validate size
$maxSize = $uploadType === 'carrier_logo' ? 2 * 1024 * 1024 : 10 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    echo json_encode(['success' => false, 'message' => 'File too large']);
    exit;
}

// Validate type
$allowedTypes = $uploadType === 'carrier_logo' 
    ? ['image/jpeg', 'image/png'] 
    : ['application/pdf'];

$fileMimeType = mime_content_type($file['tmp_name']);
if (!in_array($fileMimeType, $allowedTypes)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type']);
    exit;
}

$extension = $uploadType === 'carrier_logo' 
    ? ($fileMimeType === 'image/jpeg' ? 'jpg' : 'png')
    : 'pdf';

// Create directory
$uploadPath = __DIR__ . '/../assets/img/carrier/' . $uploadType;
if (!file_exists($uploadPath)) {
    mkdir($uploadPath, 0755, true);
}

// Generate filename
$fileName = $uploadType . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $extension;
$filePath = $uploadPath . '/' . $fileName;

if (!move_uploaded_file($file['tmp_name'], $filePath)) {
    echo json_encode(['success' => false, 'message' => 'Failed to save file']);
    exit;
}

$relativePath = "assets/img/carrier/{$uploadType}/{$fileName}";

echo json_encode([
    'success' => true,
    'message' => 'File uploaded successfully',
    'data' => [
        'fileName' => $fileName,
        'filePath' => $relativePath
    ]
]);

