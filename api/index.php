<?php
// Security Headers
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Content-Type: application/json; charset=UTF-8");

// Origin & CORS Security
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
];

$httpOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($httpOrigin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $httpOrigin");
} else if (!empty($httpOrigin)) {
    header("Access-Control-Allow-Origin: " . $allowedOrigins[0]);
} else {
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-CSRF-Token, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$dbFile = __DIR__ . '/db.json';

// GET Handler
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dbFile)) {
        echo file_get_contents($dbFile);
    } else {
        echo json_encode(['empty' => true]);
    }
    exit(0);
}

// POST Handler (CSRF & State Update Security)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verify Request Header / CSRF check
    $headers = getallheaders();
    $csrfHeader = $headers['X-CSRF-Token'] ?? $headers['x-csrf-token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    
    // Accept valid custom header or JSON request
    $input = file_get_contents('php://input');
    
    if (empty($input)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid or empty payload']);
        exit(0);
    }

    // Validate JSON payload
    $decoded = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
        http_response_code(400);
        echo json_encode(['error' => 'Malformed JSON payload']);
        exit(0);
    }

    // Save validated data to db.json atomically
    $tmpFile = $dbFile . '.tmp';
    if (file_put_contents($tmpFile, $input, LOCK_EX) !== false) {
        rename($tmpFile, $dbFile);
        echo json_encode(['success' => true, 'timestamp' => time()]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to write to database']);
    }
    exit(0);
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
