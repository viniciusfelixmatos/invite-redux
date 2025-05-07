import { useState, useEffect, useCallback } from "react";

function useChat() {
    // State variables for chat functionality
    const [messages, setMessages] = useState([]);       // Stores all fetched chat messages
    const [newMessage, setNewMessage] = useState("");   // Holds the current input message
    const [isTyping, setIsTyping] = useState(false);    // Indicates whether the user is typing
    const [loading, setLoading] = useState(false);      // Indicates whether a message is being sent
    const [error, setError] = useState(null);           // Holds error messages to display in UI

    // Backend API URL (supports environment override for dev/production)
    const API_URL = import.meta.env.VITE_API_URL || 'https://invite-redux.onrender.com/api';

    // Centralized error messages
    const errorMessages = {
        fetchError: "Failed to load messages. Please refresh the page.",
        invalidData: "Invalid message format received from server.",
        sendError: "Failed to send message.",
        networkError: "Network error. Please check your connection.",
        authError: "Session expired. Please login again.",
        timeout: "Request timed out. Please try again."
    };

    // Fetches all messages from the backend
    const fetchMessages = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/messages.php`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                signal: AbortSignal.timeout(10000) // Abort request if it takes longer than 10 seconds
            });

            if (!response.ok) {
                throw new Error(response.status === 401 ? errorMessages.authError : errorMessages.fetchError);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error(errorMessages.invalidData);
            }

            setMessages(data);  // Update local message list
            setError(null);     // Clear any previous errors

        } catch (err) {
            console.error("Error fetching messages:", err);
            const fallback = err.name === 'AbortError' ? errorMessages.timeout : err.message || errorMessages.fetchError;
            setError(fallback);
        }
    }, [API_URL]);

    // Sends a new chat message to the backend
    const sendMessage = async () => {
        if (!newMessage.trim()) return;  // Prevent sending empty messages

        setLoading(true);
        setError(null);

        try {
            const username = localStorage.getItem("username") || "Anonymous";

            const response = await fetch(`${API_URL}/messages.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    text: newMessage.trim(),
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

            // Clear input and reset typing state
            setNewMessage("");
            setIsTyping(false);

            // Refresh messages after sending
            await fetchMessages();
        } catch (err) {
            console.error("Error sending message:", err);
            const fallback = err.name === 'AbortError' ? errorMessages.timeout : err.message || errorMessages.sendError;
            setError(fallback);
        } finally {
            setLoading(false);  // Clear loading state
        }
    };

    // Automatically fetch messages every 5 seconds
    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);  // Clean up on unmount
    }, [fetchMessages]);

    // Resets typing indicator after 2 seconds of inactivity
    useEffect(() => {
        if (isTyping) {
            const timeout = setTimeout(() => setIsTyping(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [isTyping, newMessage]);

    // Handles user input and updates typing state
    const handleTyping = (value) => {
        setNewMessage(value);
        setIsTyping(!!value.trim());
    };

    // Hook return: exposes chat-related state and handlers
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
