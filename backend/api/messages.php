<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$messagesFile = __DIR__ . '/messages.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!file_exists($messagesFile)) {
        echo json_encode([]);
        exit;
    }

    $messages = json_decode(file_get_contents($messagesFile), true);
    echo json_encode($messages);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['text']) || trim($data['text']) === '' || 
        !isset($data['username']) || trim($data['username']) === '' || 
        !isset($data['icon']) || trim($data['icon']) === '') {
        echo json_encode(["status" => "error", "message" => "Dados inválidos."]);
        exit;
    }

    $message = [
        "username" => htmlspecialchars($data['username']),
        "icon" => htmlspecialchars($data['icon']),
        "text" => htmlspecialchars($data['text']),
    ];

    $messages = file_exists($messagesFile) ? json_decode(file_get_contents($messagesFile), true) : [];
    $messages[] = $message;

    file_put_contents($messagesFile, json_encode($messages, JSON_PRETTY_PRINT));
    echo json_encode(["status" => "success", "message" => "Mensagem enviada com sucesso."]);
    exit;
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Método não permitido."]);