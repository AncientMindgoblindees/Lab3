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
    $imgType = exif_imagetype($tmpFile);
    $image = false;
    if (!extension_loaded('gd')) {
        $response["message"] = "GD extension not enabled. Cannot process images.";
    } else {
        if ($imgType === IMAGETYPE_JPEG) {
            $image = @imagecreatefromjpeg($tmpFile);
            if (!$image) {
                $response["message"] = "Failed to process JPEG image. File may be corrupted or not a valid JPEG.";
            }
        } elseif ($imgType === IMAGETYPE_PNG) {
            $image = @imagecreatefrompng($tmpFile);
            if (!$image) {
                $response["message"] = "Failed to process PNG image. File may be corrupted or not a valid PNG.";
            }
        } elseif ($imgType === IMAGETYPE_GIF) {
            $image = @imagecreatefromgif($tmpFile);
            if (!$image) {
                $response["message"] = "Failed to process GIF image. File may be corrupted or not a valid GIF.";
            }
        } else {
            $response["message"] = "Unsupported image type. Please upload JPG, PNG, or GIF.";
        }
        if ($image) {
            // Convert and save as JPEG (quality 85)
            if (imagejpeg($image, $targetFile, 85)) {
                $response["success"] = true;
                $response["message"] = "Image uploaded and converted to JPEG.";
                $response["url"] = 'assets/images/' . $profile . '.jpg';
            } else {
                $response["message"] = "Failed to save converted image.";
            }
            imagedestroy($image);
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
