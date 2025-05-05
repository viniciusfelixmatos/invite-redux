import { useState, useEffect, useCallback } from "react";

function useChat() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'https://backend-php-api.onrender.com/api';

    const errorMessages = {
        fetchError: "Failed to load messages. Please refresh the page.",
        invalidData: "Invalid message format received from server",
        sendError: "Failed to send message",
        networkError: "Network error. Please check your connection.",
        authError: "Session expired. Please login again.",
        timeout: "Request timed out. Please try again."
    };

    const fetchMessages = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/messages.php`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) {
                throw new Error(response.status === 401 ? errorMessages.authError : errorMessages.fetchError);
            }

            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error(errorMessages.invalidData);
            }

            setMessages(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setError(error.name === 'AbortError' ? errorMessages.timeout : error.message);
        }
    }, [API_URL]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const username = localStorage.getItem("username") || "Anonymous";
            const response = await fetch(`${API_URL}/messages.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    text: newMessage,
                    username,
                    icon: "bi-person-circle",
                    timestamp: new Date().toISOString()
                }),
                signal: AbortSignal.timeout(10000)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || errorMessages.sendError);
            }

            setNewMessage("");
            setIsTyping(false);
            await fetchMessages();
        } catch (error) {
            console.error("Error sending message:", error);
            setError(error.name === 'AbortError' ? errorMessages.timeout : error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    useEffect(() => {
        if (isTyping) {
            const timeout = setTimeout(() => setIsTyping(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [isTyping, newMessage]);

    const handleTyping = (value) => {
        setNewMessage(value);
        setIsTyping(!!value.trim());
    };

    return { 
        messages, 
        newMessage, 
        handleTyping,
        sendMessage, 
        isTyping, 
        loading,
        error,
        retryFetch: fetchMessages
    };
}

export default useChat;