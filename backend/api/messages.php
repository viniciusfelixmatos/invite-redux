<?php

// Set response headers for JSON and CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Define the path to the JSON file where messages are stored
$messagesFile = __DIR__ . '/messages.json';

// Handle GET requests to return the message list
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($messagesFile)) {
        // If file does not exist, return an empty array
        echo json_encode([]);
        exit;
    }

    // Read and decode messages, then return as JSON
    $messages = json_decode(file_get_contents($messagesFile), true);
    echo json_encode($messages);
    exit;
}

// Handle POST requests to add a new message
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode incoming JSON data
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate required fields: text, username, and icon
    if (!isset($data['text']) || trim($data['text']) === '' || 
        !isset($data['username']) || trim($data['username']) === '' || 
        !isset($data['icon']) || trim($data['icon']) === '') {
        echo json_encode(["status" => "error", "message" => "Dados inválidos."]);
        exit;
    }

    // Sanitize message content to prevent XSS
    $message = [
        "username" => htmlspecialchars($data['username']),
        "icon" => htmlspecialchars($data['icon']),
        "text" => htmlspecialchars($data['text']),
    ];

    // Load existing messages or initialize a new array
    $messages = file_exists($messagesFile) ? json_decode(file_get_contents($messagesFile), true) : [];
    
    // Append the new message to the array
    $messages[] = $message;

    // Save updated messages back to the file
    file_put_contents($messagesFile, json_encode($messages, JSON_PRETTY_PRINT));

    // Return success response
    echo json_encode(["status" => "success", "message" => "Mensagem enviada com sucesso."]);
    exit;
}

// Return error for unsupported HTTP methods
http_response_code(405);
echo json_encode(["status" => "error", "message" => "Método não permitido."]);
