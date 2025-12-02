<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    // Try form data
    $data = $_POST;
}

$profile = isset($data['profile']) ? preg_replace('/[^a-zA-Z0-9]/', '', $data['profile']) : '';
$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$message = isset($data['message']) ? trim($data['message']) : '';

// Validate required fields
if (empty($profile) || empty($name) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Profile, name, and message are required']);
    exit;
}

// Create logs directory if it doesn't exist
$logsDir = __DIR__ . '/logs';
if (!is_dir($logsDir)) {
    mkdir($logsDir, 0755, true);
}

// Log file path for this profile
$logFile = $logsDir . '/' . $profile . '_messages.json';

// Load existing messages
$messages = [];
if (file_exists($logFile)) {
    $content = file_get_contents($logFile);
    $messages = json_decode($content, true) ?: [];
}

// Create new message entry
$newMessage = [
    'id' => uniqid(),
    'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
    'email' => htmlspecialchars($email, ENT_QUOTES, 'UTF-8'),
    'phone' => htmlspecialchars($phone, ENT_QUOTES, 'UTF-8'),
    'message' => htmlspecialchars($message, ENT_QUOTES, 'UTF-8'),
    'timestamp' => date('Y-m-d H:i:s'),
    'profile' => $profile
];

// Add to messages array
$messages[] = $newMessage;

// Save to file
if (file_put_contents($logFile, json_encode($messages, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true, 'message' => 'Message saved successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save message']);
}
?>
