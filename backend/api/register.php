<?php

// Set content type as JSON and configure CORS headers
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Language');

// Enable error reporting (useful during development, disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Determine the language based on the request headers (default: English)
$language = 'en';
if (isset($_SERVER['HTTP_X_LANGUAGE'])) {
    $language = strtolower(substr($_SERVER['HTTP_X_LANGUAGE'], 0, 2));
} elseif (isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
    $language = strtolower(substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2));
}
// Ensure the language is either 'pt' or 'en', fallback to 'en'
$language = in_array($language, ['pt', 'en']) ? $language : 'en';

// Multi-language messages used for success and error responses
$messages = [
    'success' => [
        'en' => 'User registered successfully',
        'pt' => 'Usuário registrado com sucesso'
    ],
    'errors' => [
        'request_read' => [
            'en' => 'Failed to read input data',
            'pt' => 'Falha ao ler os dados de entrada'
        ],
        'invalid_json' => [
            'en' => 'Invalid JSON: %s',
            'pt' => 'JSON inválido: %s'
        ],
        'missing_field' => [
            'en' => 'Missing field: %s',
            'pt' => 'Campo obrigatório: %s'
        ],
        'empty_field' => [
            'en' => 'Empty field: %s',
            'pt' => 'Campo vazio: %s'
        ],
        'min_length' => [
            'en' => '%s must be at least %d characters',
            'pt' => '%s deve ter pelo menos %d caracteres'
        ],
        'max_length' => [
            'en' => '%s must be at most %d characters',
            'pt' => '%s deve ter no máximo %d caracteres'
        ],
        'invalid_chars' => [
            'en' => 'Invalid characters in %s',
            'pt' => 'Caracteres inválidos em %s'
        ],
        'file_read' => [
            'en' => 'Failed to read users file',
            'pt' => 'Falha ao ler arquivo de usuários'
        ],
        'file_corrupt' => [
            'en' => 'Corrupt users file: %s',
            'pt' => 'Arquivo de usuários corrompido: %s'
        ],
        'login_exists' => [
            'en' => 'Login already exists',
            'pt' => 'Login já existe'
        ],
        'username_exists' => [
            'en' => 'Username already exists',
            'pt' => 'Nome de usuário já existe'
        ],
        'save_error' => [
            'en' => 'Failed to save user data',
            'pt' => 'Falha ao salvar dados do usuário'
        ]
    ]
];

// Respond to OPTIONS requests quickly (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Read the JSON data sent in the request body
    $jsonInput = file_get_contents('php://input');
    if ($jsonInput === false) {
        throw new Exception($messages['errors']['request_read'][$language]);
    }

    // Decode the incoming JSON data
    $data = json_decode($jsonInput, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception(sprintf(
            $messages['errors']['invalid_json'][$language],
            json_last_error_msg()
        ));
    }

    // Define the required fields with validation rules for length and pattern
    $required = [
        'login' => ['min' => 3, 'max' => 50, 'pattern' => '/^[a-zA-Z0-9_]+$/'],
        'password' => ['min' => 6, 'max' => 100],
        'username' => ['min' => 2, 'max' => 50]
    ];

    // Validate each field according to its rules: existence, length, and format
    foreach ($required as $field => $rules) {
        if (!isset($data[$field])) {
            throw new Exception(sprintf(
                $messages['errors']['missing_field'][$language],
                $field
            ));
        }

        $value = trim($data[$field]);
        if (empty($value)) {
            throw new Exception(sprintf(
                $messages['errors']['empty_field'][$language],
                $field
            ));
        }

        if (strlen($value) < $rules['min']) {
            throw new Exception(sprintf(
                $messages['errors']['min_length'][$language],
                $field,
                $rules['min']
            ));
        }

        if (strlen($value) > $rules['max']) {
            throw new Exception(sprintf(
                $messages['errors']['max_length'][$language],
                $field,
                $rules['max']
            ));
        }

        if (isset($rules['pattern']) && !preg_match($rules['pattern'], $value)) {
            throw new Exception(sprintf(
                $messages['errors']['invalid_chars'][$language],
                $field
            ));
        }
    }

    // Path to the file storing user data
    $usuariosFile = __DIR__ . '/usuarios.json';

    $usuarios = [];
    if (file_exists($usuariosFile)) {
        $fileContent = file_get_contents($usuariosFile);
        if ($fileContent === false) {
            throw new Exception($messages['errors']['file_read'][$language]);
        }

        $usuarios = json_decode($fileContent, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception(sprintf(
                $messages['errors']['file_corrupt'][$language],
                json_last_error_msg()
            ));
        }
    }

    // Check if the login or username already exists
    foreach ($usuarios as $usuario) {
        if ($usuario['login'] === $data['login']) {
            throw new Exception($messages['errors']['login_exists'][$language]);
        }
        if ($usuario['username'] === $data['username']) {
            throw new Exception($messages['errors']['username_exists'][$language]);
        }
    }

    // Create a new user with hashed password and creation date
    $novoUsuario = [
        "login" => $data['login'],
        "password" => password_hash($data['password'], PASSWORD_DEFAULT),
        "username" => htmlspecialchars($data['username'], ENT_QUOTES, 'UTF-8'),
        "created_at" => date('Y-m-d H:i:s')
    ];

    $usuarios[] = $novoUsuario;

    // Save the user data to the file with exclusive lock
    $result = file_put_contents(
        $usuariosFile, 
        json_encode($usuarios, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
        LOCK_EX
    );

    if ($result === false) {
        throw new Exception($messages['errors']['save_error'][$language]);
    }

    // Return success response
    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => $messages['success'][$language],
        "user" => [
            "username" => $novoUsuario['username'],
            "created_at" => $novoUsuario['created_at'],
            "language" => $language
        ]
    ]);

} catch (Exception $e) {
    // Log the error for debugging and return error response
    error_log('Registration Error: ' . $e->getMessage());

    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage(),
        "request_data" => $data ?? null,
        "timestamp" => date('Y-m-d H:i:s'),
        "language" => $language
    ]);
}
?>
