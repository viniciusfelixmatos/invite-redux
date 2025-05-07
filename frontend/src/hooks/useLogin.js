import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function useLogin() {
    // Local state for loading status, error, and success message
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // React Router navigation hook
    const navigate = useNavigate();

    // Internationalization hook
    const { t, i18n } = useTranslation();

    // Backend API endpoint
    const API_URL = 'https://invite-redux.onrender.com/api';

    // Translatable messages for success and various error states
    const messages = {
        success: {
            en: 'Login successful!',
            pt: 'Login realizado com sucesso!'
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
            invalidCredentials: {
                en: 'Invalid credentials.',
                pt: 'Credenciais inválidas.'
            }
        }
    };

    // Async function to log in a user
    const login = async (loginInput, password) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Send POST request to login endpoint
            const response = await fetch(`${API_URL}/login.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Language": i18n.language
                },
                body: JSON.stringify({ login: loginInput, password }),
                signal: AbortSignal.timeout(15000) // Abort request if no response in 15 seconds
            });

            // Validate response content-type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const errorText = await response.text();
                throw new Error(errorText || messages.errors.invalidResponse[i18n.language]);
            }

            const data = await response.json();

            // Handle HTTP or application-level errors
            if (!response.ok) {
                throw new Error(data?.message || `Error ${response.status}`);
            }

            if (!data || typeof data !== 'object') {
                throw new Error(messages.errors.invalidResponse[i18n.language]);
            }

            // If login is successful, store token and preferences in localStorage
            if (data.status === "success") {
                localStorage.setItem("authToken", data.token || "");
                localStorage.setItem("username", data.username || "");
                localStorage.setItem("userLanguage", data.language || i18n.language);

                // Sync frontend language with backend preference if needed
                if (data.language && data.language !== i18n.language) {
                    i18n.changeLanguage(data.language);
                }

                setSuccessMessage(data.message || messages.success[i18n.language]);

                // Redirect to home after a short delay
                setTimeout(() => navigate("/home"), 1000);
                return true;
            } else {
                throw new Error(data.message || messages.errors.invalidCredentials[i18n.language]);
            }

        } catch (err) {
            let errorMessage;

            // Detect and handle different types of errors
            if (err.name === 'AbortError') {
                errorMessage = messages.errors.timeout[i18n.language];
            } else if (err.message.includes('Failed to fetch')) {
                errorMessage = messages.errors.network[i18n.language];
            } else {
                errorMessage = err.message || messages.errors.invalidResponse[i18n.language];
            }

            setError(errorMessage);
            return false;

        } finally {
            setLoading(false); // Always clear loading state at the end
        }
    };

    // Helper to clear messages from UI
    const resetMessages = () => {
        setError(null);
        setSuccessMessage(null);
    };

    // Return the hook API
    return {
        login,
        loading,
        error,
        successMessage,
        resetMessages
    };
}

export default useLogin;
