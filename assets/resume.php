<?php
// assets/resume.php
// Save or load resume (PDF) for a profile

$resumeDir = __DIR__ . '/resumes';

// Ensure the resumes directory exists
if (!is_dir($resumeDir)) {
    mkdir($resumeDir, 0775, true);
}

$profile = isset($_POST['profile']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['profile']) : (isset($_GET['profile']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['profile']) : '');
$resumeFile = $resumeDir . "/" . $profile . ".pdf";

$response = ["success" => false, "message" => ""];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle resume upload
    if ($profile && isset($_FILES['resume']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
        $tmpName = $_FILES['resume']['tmp_name'];
        $mimeType = mime_content_type($tmpName);
        
        // Only allow PDF files
        if ($mimeType === 'application/pdf') {
            // Delete old resume if exists
            if (file_exists($resumeFile)) {
                unlink($resumeFile);
            }
            
            if (move_uploaded_file($tmpName, $resumeFile)) {
                $response["success"] = true;
                $response["message"] = "Resume uploaded successfully.";
            } else {
                $response["message"] = "Failed to save resume.";
            }
        } else {
            $response["message"] = "Invalid file type. Only PDF files are allowed.";
        }
    } else {
        $response["message"] = "Missing profile or resume file.";
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET' && $profile) {
    // Check if resume exists
    if (file_exists($resumeFile)) {
        $response["success"] = true;
        $response["exists"] = true;
        $response["url"] = "/assets/resumes/" . $profile . ".pdf";
    } else {
        $response["success"] = true;
        $response["exists"] = false;
        $response["message"] = "No resume found.";
    }
} else {
    $response["message"] = "Invalid request.";
}

header('Content-Type: application/json');
echo json_encode($response);
