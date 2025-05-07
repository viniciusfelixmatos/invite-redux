import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Defines the translation resources for each supported language
const resources = {
  en: {
    translation: {
      welcome: "Welcome to Invite!",
      subtitle: "Connect with your friends easily and quickly",
      registerTitle: "REGISTER",
      usernamePlaceholder: "Choose a username",
      loginPlaceholder: "Enter your login",
      passwordPlaceholder: "Enter your password",
      register: "Register",
      noAccount: "Don't have an account?",
      alreadyHaveAccount: "Already have an account?",
      login: "Login",
      chatTitle: "Invite Chat",
      generalChat: "General Chat",
      noMessages: "No messages yet.",
      someoneTyping: "Someone is typing...",
      messagePlaceholder: "Type your message...",
      send: "Send",
      loggingIn: "Logging in...",
    },
  },
  pt: {
    translation: {
      welcome: "Bem-vindo ao Invite!",
      subtitle: "Conecte-se com seus amigos de forma simples e rápida",
      registerTitle: "REGISTRE-SE",
      usernamePlaceholder: "Escolha um nome de usuário",
      loginPlaceholder: "Digite seu login",
      passwordPlaceholder: "Digite sua senha",
      register: "Registrar",
      noAccount: "Não tem uma conta?",
      alreadyHaveAccount: "Já tem uma conta?",
      login: "Faça login",
      chatTitle: "Invite Chat",
      generalChat: "Bate-Papo Geral",
      noMessages: "Nenhuma mensagem ainda.",
      someoneTyping: "Alguém está digitando...",
      messagePlaceholder: "Digite sua mensagem...",
      send: "Enviar",
      loggingIn: "Entrando...",
    },
  },
};

// Initializes the i18n instance with plugins and configuration
i18n
  .use(LanguageDetector)        // Detects user language from the browser
  .use(initReactI18next)        // Passes i18n instance to react-i18next
  .init({
    resources,                  // Loaded translation resources
    fallbackLng: "en",          // Default language if detection fails
    interpolation: {
      escapeValue: false,       // React already escapes by default
    },
  });

export default i18n;            // Makes the configured i18n available for import
