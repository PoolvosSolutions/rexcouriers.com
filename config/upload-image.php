<?php
// api/upload-image.php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'File upload error.']);
    exit;
}

// 1. Determine target folder based on 'type' parameter (Security: prevents directory traversal)
$type = $_POST['type'] ?? '';
$folderMap = [
    'category' => __DIR__ . '/../assets/img/catimg/',
    'merchant' => __DIR__ . '/../assets/img/merchantimg/',
    'branch'   => __DIR__ . '/../assets/img/branchimg/',  // 🔥 ADD THIS
    'product'  => __DIR__ . '/../assets/img/productimg/',  // 🔥 ADD THIS
    'coupon'   => __DIR__ . '/../assets/img/couponimg/',  // 🔥 ADD THIS
    'voucher'  => __DIR__ . '/../assets/img/voucherimg/', // For future use
    'user'     => __DIR__ . '/../assets/img/userimg/'  // 🔥 ADD THIS
];

if (!isset($folderMap[$type])) {
    echo json_encode(['success' => false, 'message' => 'Invalid upload type.']);
    exit;
}

$targetDir = $folderMap[$type];

// Ensure directory exists
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

$file = $_FILES['image'];

// 2. Validate Size (Max 200KB) & Type
if ($file['size'] > 200 * 1024) {
    echo json_encode(['success' => false, 'message' => 'File size exceeds 200KB limit.']);
    exit;
}

$allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type.']);
    exit;
}

// 3. Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
if (strtolower($extension) === 'jpeg') $extension = 'jpg';
$newFilename = $type . '_' . uniqid() . '_' . time() . '.' . $extension;
$targetPath = $targetDir . $newFilename;

// 4. Move file
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    // Map back to relative web path
    $webFolderMap = [
        'category' => 'assets/img/catimg/',
        'merchant' => 'assets/img/merchantimg/',
        'branch'   => 'assets/img/branchimg/',  // 🔥 ADD THIS
        'product'  => 'assets/img/productimg/',  // 🔥 ADD THIS
        'coupon'   => 'assets/img/couponimg/',  // 🔥 ADD THIS
        'voucher'  => 'assets/img/voucherimg/',
        $user => 'assets/img/userimg/'
    ];
    $relativePath = $webFolderMap[$type] . $newFilename;
    
    echo json_encode(['success' => true, 'message' => 'Uploaded.', 'path' => $relativePath]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to save file.']);
}

