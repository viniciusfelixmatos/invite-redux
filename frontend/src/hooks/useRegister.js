import { useState } from "react";
import { useTranslation } from 'react-i18next';

function useRegister() {
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { i18n } = useTranslation();

    const API_URL = 'https://backend-php-api.onrender.com/api';

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
                en: 'Invalid server response',
                pt: 'Resposta inválida do servidor'
            }
        }
    };

    const register = async (login, password, username) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!login || !password || !username) {
            setError(i18n.t('register.errors.requiredFields'));
            setIsLoading(false);
            return false;
        }

        try {
            const response = await fetch(`${API_URL}/register.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Language": i18n.language
                },
                body: JSON.stringify({ login, password, username }),
                signal: AbortSignal.timeout(15000)
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const errorText = await response.text();
                throw new Error(errorText || messages.errors.invalidResponse[i18n.language]);
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}`);
            }

            if (data.status === "success") {
                setSuccessMessage(data.message || messages.success[i18n.language]);
                return true;
            } else {
                throw new Error(data.message || i18n.t('register.errors.general'));
            }
        } catch (err) {
            let errorMessage;
            
            if (err.name === 'AbortError') {
                errorMessage = messages.errors.timeout[i18n.language];
            } else if (err.message.includes('Failed to fetch')) {
                errorMessage = messages.errors.network[i18n.language];
            } else {
                errorMessage = err.message;
            }
            
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
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