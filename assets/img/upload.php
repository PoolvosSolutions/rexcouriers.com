<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(403);
    echo json_encode(["error" => "Direct access not allowed."]);
    exit;
}

$uploadDir = "uploads/";
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$response = [];

foreach (['idCard', 'idCardBack', 'passport'] as $field) {
    if (isset($_FILES[$field])) {
        $timestamp = time();
        $originalName = basename($_FILES[$field]["name"]);
        $filename = $field . "_" . $timestamp . "_" . $originalName;
        $targetPath = $uploadDir . $filename;

        if ($_FILES[$field]["size"] > 25 * 1024 * 1024) {
            $response[$field] = "File too large";
            continue;
        }

        if (move_uploaded_file($_FILES[$field]["tmp_name"], $targetPath)) {
            $response[$field] = "Success";
            $response[$field . "_path"] = $targetPath;
        } else {
            $response[$field] = "Upload failed";
        }
    } else {
        $response[$field] = "Not provided";
    }
}

echo json_encode($response);
exit;


?>