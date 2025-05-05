import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

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

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;