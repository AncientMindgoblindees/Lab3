<?php
// assets/save_major.php
// Save or load major/info for a profile

$majorDir = __DIR__ . '/text';

// Ensure the text directory exists
if (!is_dir($majorDir)) {
    mkdir($majorDir, 0775, true);
}

$profile = isset($_POST['profile']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['profile']) : (isset($_GET['profile']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['profile']) : '');
$majorFile = $majorDir . "/major-" . $profile . ".txt";

$response = ["success" => false, "message" => ""];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $major = isset($_POST['major']) ? $_POST['major'] : '';
    if ($profile) {
        if (file_put_contents($majorFile, $major) !== false) {
            $response["success"] = true;
            $response["message"] = "Major saved.";
        } else {
            $response["message"] = "Failed to save major.";
        }
    } else {
        $response["message"] = "Missing profile.";
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET' && $profile) {
    if (file_exists($majorFile)) {
        $response["success"] = true;
        $response["major"] = file_get_contents($majorFile);
    } else {
        $response["success"] = true;
        $response["major"] = "";
        $response["message"] = "No major found.";
    }
} else {
    $response["message"] = "Invalid request.";
}

header('Content-Type: application/json');
echo json_encode($response);
