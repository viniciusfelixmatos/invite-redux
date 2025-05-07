<?php

// Set response headers for JSON and CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Language');
header('Access-Control-Allow-Credentials: true');

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Detect language from custom header (default: 'pt')
$language = $_SERVER['HTTP_X_LANGUAGE'] ?? 'pt';

// Define localized messages for different response scenarios
$messages = [
    'pt' => [
        'incomplete_data' => 'Dados incompletos.',
        'user_not_found' => 'Usuário não encontrado.',
        'wrong_password' => 'Senha incorreta.',
        'success' => 'Login bem-sucedido!'
    ],
    'en' => [
        'incomplete_data' => 'Incomplete data.',
        'user_not_found' => 'User not found.',
        'wrong_password' => 'Wrong password.',
        'success' => 'Login successful!'
    ]
];

// Get JSON input from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Validate that login and password are provided
if (!isset($data['login']) || !isset($data['password'])) {
    echo json_encode([
        "status" => "error", 
        "message" => $messages[$language]['incomplete_data']
    ]);
    exit;
}

// Load users from the JSON file
$usuariosFile = __DIR__ . '/usuarios.json';
$usuarios = file_exists($usuariosFile) ? json_decode(file_get_contents($usuariosFile), true) : [];

// Search for the user by login
$usuarioEncontrado = null;
foreach ($usuarios as $usuario) {
    if ($usuario['login'] === $data['login']) {
        $usuarioEncontrado = $usuario;
        break;
    }
}

// Return error if user not found
if (!$usuarioEncontrado) {
    echo json_encode([
        "status" => "error", 
        "message" => $messages[$language]['user_not_found']
    ]);
    exit;
}

// Check if password is correct using password_verify
if (!password_verify($data['password'], $usuarioEncontrado['password'])) {
    echo json_encode([
        "status" => "error", 
        "message" => $messages[$language]['wrong_password']
    ]);
    exit;
}

// Generate a random token for authentication
$token = bin2hex(random_bytes(16));

// Return success response with user info and token
echo json_encode([
    "status" => "success",
    "message" => $messages[$language]['success'],
    "username" => $usuarioEncontrado['username'] ?? null,
    "token" => $token,
    "language" => $usuarioEncontrado['language'] ?? $language
]);
