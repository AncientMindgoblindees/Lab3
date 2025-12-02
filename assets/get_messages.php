<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

$logsDir = __DIR__ . '/logs';
$allMessages = [];

// Check if logs directory exists
if (is_dir($logsDir)) {
    // Get all message files
    $files = glob($logsDir . '/*_messages.json');
    
    foreach ($files as $file) {
        $content = file_get_contents($file);
        $messages = json_decode($content, true);
        
        if (is_array($messages)) {
            $allMessages = array_merge($allMessages, $messages);
        }
    }
}

// Sort by timestamp (newest first)
usort($allMessages, function($a, $b) {
    return strtotime($b['timestamp']) - strtotime($a['timestamp']);
});

echo json_encode(['success' => true, 'messages' => $allMessages]);
?>
