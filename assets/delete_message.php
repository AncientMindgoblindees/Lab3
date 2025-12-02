<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    $data = $_POST;
}

$messageId = isset($data['id']) ? $data['id'] : '';
$profile = isset($data['profile']) ? preg_replace('/[^a-zA-Z0-9]/', '', $data['profile']) : '';

if (empty($messageId) || empty($profile)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Message ID and profile are required']);
    exit;
}

$logsDir = __DIR__ . '/logs';
$logFile = $logsDir . '/' . $profile . '_messages.json';

if (!file_exists($logFile)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Log file not found']);
    exit;
}

// Load existing messages
$content = file_get_contents($logFile);
$messages = json_decode($content, true) ?: [];

// Find and remove the message
$found = false;
$newMessages = [];
foreach ($messages as $msg) {
    if ($msg['id'] === $messageId) {
        $found = true;
    } else {
        $newMessages[] = $msg;
    }
}

if (!$found) {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Message not found']);
    exit;
}

// Save updated messages
if (file_put_contents($logFile, json_encode($newMessages, JSON_PRETTY_PRINT))) {
    echo json_encode(['success' => true, 'message' => 'Message deleted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to delete message']);
}
?>
