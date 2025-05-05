<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Language');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$language = $_SERVER['HTTP_X_LANGUAGE'] ?? 'pt';

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

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['login']) || !isset($data['password'])) {
    echo json_encode([
        "status" => "error", 
        "message" => $messages[$language]['incomplete_data']
    ]);
    exit;
}

$usuariosFile = __DIR__ . '/usuarios.json';
$usuarios = file_exists($usuariosFile) ? json_decode(file_get_contents($usuariosFile), true) : [];

$usuarioEncontrado = null;
foreach ($usuarios as $usuario) {
    if ($usuario['login'] === $data['login']) {
        $usuarioEncontrado = $usuario;
        break;
    }
}

if (!$usuarioEncontrado) {
    echo json_encode([
        "status" => "error", 
        "message" => $messages[$language]['user_not_found']
    ]);
    exit;
}

if (!password_verify($data['password'], $usuarioEncontrado['password'])) {
    echo json_encode([
        "status" => "error", 
        "message" => $messages[$language]['wrong_password']
    ]);
    exit;
}

$token = bin2hex(random_bytes(16));

echo json_encode([
    "status" => "success",
    "message" => $messages[$language]['success'],
    "username" => $usuarioEncontrado['username'] ?? null,
    "token" => $token,
    "language" => $usuarioEncontrado['language'] ?? $language
]);