<?php
// api/uploadCustomerDocument.php
// 🔥 Secure Document Upload API for Customer Documents

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Only POST is allowed.'
    ]);
    exit;
}

// 🔥 CONFIGURATION
$MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
$ALLOWED_TYPES = [
    'image/jpeg' => 'jpg',
    'image/jpg' => 'jpg',
    'image/png' => 'png',
    'application/pdf' => 'pdf'
];

// 🔥 GET UPLOAD TYPE (cnic or business)
$uploadType = $_POST['uploadType'] ?? '';

if (empty($uploadType) || !in_array($uploadType, ['cnic', 'business'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid upload type. Must be "cnic" or "business".'
    ]);
    exit;
}

// 🔥 CHECK IF FILE EXISTS
if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE => 'File exceeds server upload limit',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds form upload limit',
        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION => 'File upload stopped by extension'
    ];
    
    $errorCode = $_FILES['document']['error'] ?? -1;
    $errorMessage = $errorMessages[$errorCode] ?? 'Unknown upload error';
    
    echo json_encode([
        'success' => false,
        'message' => $errorMessage
    ]);
    exit;
}

$file = $_FILES['document'];

// 🔥 VALIDATE FILE SIZE
if ($file['size'] > $MAX_FILE_SIZE) {
    echo json_encode([
        'success' => false,
        'message' => 'File size exceeds 5MB limit'
    ]);
    exit;
}

// 🔥 VALIDATE FILE TYPE
$fileMimeType = mime_content_type($file['tmp_name']);
if (!array_key_exists($fileMimeType, $ALLOWED_TYPES)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid file type. Only JPG, PNG, and PDF are allowed.'
    ]);
    exit;
}

$fileExtension = $ALLOWED_TYPES[$fileMimeType];

// 🔥 CREATE UPLOAD DIRECTORY
$baseUploadPath = __DIR__ . '/../assets/img/customer/' . $uploadType;

if (!file_exists($baseUploadPath)) {
    if (!mkdir($baseUploadPath, 0755, true)) {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create upload directory'
        ]);
        exit;
    }
}

// 🔥 GENERATE UNIQUE FILENAME
// Format: customer_{customerId}_{type}_{timestamp}_{random}.ext
$customerId = $_POST['customerId'] ?? 'temp';
$timestamp = time();
$random = bin2hex(random_bytes(4));
$fileName = "customer_{$customerId}_{$uploadType}_{$timestamp}_{$random}.{$fileExtension}";
$filePath = $baseUploadPath . '/' . $fileName;

// 🔥 MOVE UPLOADED FILE
if (!move_uploaded_file($file['tmp_name'], $filePath)) {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to save uploaded file'
    ]);
    exit;
}

// 🔥 GENERATE RELATIVE URL (for database storage)
$relativePath = "assets/img/customer/{$uploadType}/{$fileName}";

// 🔥 SUCCESS RESPONSE
echo json_encode([
    'success' => true,
    'message' => 'File uploaded successfully',
    'data' => [
        'fileName' => $fileName,
        'filePath' => $relativePath,
        'fileSize' => $file['size'],
        'fileType' => $fileExtension,
        'uploadType' => $uploadType
    ]
]);

