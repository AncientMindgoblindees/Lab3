<?php
// assets/text/save_bio.php
// Save or load bio for a profile
// Always use assets/text/ for both saving and loading
$bioDir = __DIR__ . '/text';
// Ensure the text directory exists
if (!is_dir($bioDir)) {
    mkdir($bioDir, 0775, true);
}
$profile = isset($_POST['profile']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['profile']) : (isset($_GET['profile']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['profile']) : '');
$bioFile = $bioDir . "/userBio-" . $profile . ".txt";
$response = ["success" => false, "message" => ""];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $bio = isset($_POST['bio']) ? $_POST['bio'] : '';
    if ($profile && $bio !== '') {
        if (file_put_contents($bioFile, $bio) !== false) {
            $response["success"] = true;
            $response["message"] = "Bio saved.";
        } else {
            $response["message"] = "Failed to save bio.";
        }
    } else {
        $response["message"] = "Missing profile or bio.";
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET' && $profile) {
    if (file_exists($bioFile)) {
        $response["success"] = true;
        $response["bio"] = file_get_contents($bioFile);
    } else {
        $response["message"] = "No bio found.";
    }
} else {
    $response["message"] = "Invalid request.";
}
header('Content-Type: application/json');
echo json_encode($response);
