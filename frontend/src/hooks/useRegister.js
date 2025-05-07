import { useState } from "react";
import { useTranslation } from 'react-i18next';

function useRegister() {
    // State to handle error, success message, and loading indicator
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Language detection from i18n (internationalization)
    const { i18n } = useTranslation();

    // Backend API base URL
    const API_URL = 'https://invite-redux.onrender.com/api';

    // Multi-language success and error messages
    const messages = {
        success: {
            en: 'Registration successful!',
            pt: 'Registro realizado com sucesso!'
        },
        errors: {
            network: {
                en: 'Network error. Please check your connection.',
                pt: 'Erro de rede. Verifique sua conexão.'
            },
            timeout: {
                en: 'Request timeout. Server is not responding.',
                pt: 'Tempo esgotado. O servidor não está respondendo.'
            },
            invalidResponse: {
                en: 'Invalid server response.',
                pt: 'Resposta inválida do servidor.'
            },
            general: {
                en: 'An unexpected error occurred.',
                pt: 'Ocorreu um erro inesperado.'
            },
            requiredFields: {
                en: 'Please fill in all required fields.',
                pt: 'Por favor, preencha todos os campos obrigatórios.'
            }
        }
    };

    // Function to handle user registration
    const register = async (login, password, username) => {
        setIsLoading(true);      // Start loading
        setError(null);          // Clear previous error
        setSuccessMessage(null); // Clear previous success message

        // Validate required fields
        if (!login || !password || !username) {
            setError(messages.errors.requiredFields[i18n.language]);
            setIsLoading(false);
            return false;
        }

        try {
            // Send POST request to register user
            const response = await fetch(`${API_URL}/register.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Language": i18n.language
                },
                body: JSON.stringify({ login, password, username }),
                signal: AbortSignal.timeout(15000) // Abort request after 15 seconds
            });

            // Validate content type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const errorText = await response.text();
                throw new Error(errorText || messages.errors.invalidResponse[i18n.language]);
            }

            const data = await response.json();

            // Check for success response
            if (!response.ok || data.status !== "success") {
                throw new Error(data.message || messages.errors.general[i18n.language]);
            }

            // Registration successful
            setSuccessMessage(data.message || messages.success[i18n.language]);
            return true;

        } catch (err) {
            let errorMessage;

            // Timeout error
            if (err.name === 'AbortError') {
                errorMessage = messages.errors.timeout[i18n.language];
            }
            // Network connection error
            else if (err.message.includes('Failed to fetch')) {
                errorMessage = messages.errors.network[i18n.language];
            }
            // Fallback for unknown errors
            else {
                errorMessage = err.message || messages.errors.general[i18n.language];
            }

            setError(errorMessage);
            return false;

        } finally {
            setIsLoading(false); // Always stop loading indicator
        }
    };

    return {
        register,
        error,
        successMessage,
        isLoading,
        resetMessages: () => {
            setError(null);
            setSuccessMessage(null);
        }
    };
}

export default useRegister;
