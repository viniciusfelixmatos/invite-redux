import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useChat from "../../hooks/useChat";
import HomeButton from "../../components/HomeButton/HomeButton";
import "./Home.css";

function Home() {
  const { messages, newMessage, sendMessage, isTyping, handleTyping } = useChat();
  const navigate = useNavigate();
  const chatAreaRef = useRef(null);
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  const languageOptions = [
    { value: 'en', label: 'English', flag: '/flags/gb.svg' },
    { value: 'pt', label: 'Português', flag: '/flags/br.svg' }
  ];

  const currentLanguage = languageOptions.find(opt => opt.value === i18n.language) || languageOptions[0];

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage();
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <main>
      <header className="home-header">
        <button className="logout-button" onClick={handleLogout}>
          <i className="bi bi-box-arrow-left"></i>
        </button>
        <h1 className="home-title">{t("chatTitle")}</h1>

        <HomeButton 
          currentOption={currentLanguage}
          options={languageOptions}
          onChange={handleLanguageChange}
          className="language-home-button"
        />
      </header>

      <section className="home-features">
        <div className="chat-area" ref={chatAreaRef}>
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.username === localStorage.getItem("username") ? "sent" : "received"
                }`}
              >
                <i className={`chat-icon bi ${msg.icon}`}></i>
                <div className="chat-content">
                  <strong>{msg.username}</strong>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-messages">{t("noMessages")}</p>
          )}
          {isTyping && <p className="typing-indicator">{t("someoneTyping")}</p>}
        </div>

        <form className="chat-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder={t("messagePlaceholder")}
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            required
          />
          <button type="submit">
            <i className="bi bi-send"></i> {t("send")}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Home;