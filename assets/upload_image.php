<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// assets/upload_image.php
// Handles profile image uploads and saves to assets/images/

ob_start(); // Start output buffering

$targetDir = __DIR__ . '/images/';
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

$response = ["success" => false, "message" => ""];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['profileImg'])) {
    $profile = isset($_POST['profile']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['profile']) : 'default';
    $targetFile = $targetDir . $profile . '.jpg';
    $tmpFile = $_FILES['profileImg']['tmp_name'];
    $imgInfo = getimagesize($tmpFile);
    $imgType = $imgInfo ? $imgInfo[2] : false;
    $image = false;
        // If GD is not available, just save the file as-is
        $allowedTypes = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_GIF => 'gif'];
        if (!isset($allowedTypes[$imgType])) {
            $response["message"] = "Unsupported image type. Please upload JPG, PNG, or GIF.";
        } else {
            $ext = $allowedTypes[$imgType];
            // Delete any existing image for this profile
            foreach ($allowedTypes as $oldExt) {
                $oldFile = $targetDir . $profile . '.' . $oldExt;
                if (file_exists($oldFile)) {
                    @unlink($oldFile);
                }
            }
            $targetFile = $targetDir . $profile . '.' . $ext;
            if (move_uploaded_file($tmpFile, $targetFile)) {
                $response["success"] = true;
                $response["message"] = "Image uploaded successfully (no conversion).";
                $response["url"] = 'assets/images/' . $profile . '.' . $ext;
            } else {
                $response["message"] = "Failed to save image.";
            }
        }
} else {
    $response["message"] = "No image uploaded.";
}

$output = ob_get_clean();
if ($output) {
    $response["php_output"] = $output;
}

header('Content-Type: application/json');
echo json_encode($response);
