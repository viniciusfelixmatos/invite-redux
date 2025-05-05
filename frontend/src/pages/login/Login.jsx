import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../../hooks/useLogin";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/LanguageSelector/LanguageSelector";

function Login() {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, successMessage } = useLogin();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(loginInput, password, navigate);
  };

  return (
    <main className="login-content d-flex">
      <section className="section-intro d-flex flex-column">
        <div className="section-intro-content text-center">
          <h1>{t("welcome")}</h1>
          <hr className="section-divider" />
          <h2 className="section-subtitle">{t("subtitle")}</h2>
        </div>
      </section>

      <section className="section-login">
        <header>
          <h1>INVITE</h1>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-content">
            <div>
              <input
                type="text"
                id="login"
                placeholder={t("loginPlaceholder")}
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
              />
            </div>

            <div>
              <input
                type="password"
                id="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-danger">{error}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}

            <div className="d-grid">
              <button type="submit" disabled={loading}>
                {loading ? t("loggingIn") : t("login")}
              </button>
            </div>
          </div>
        </form>

        <footer>
          <p>
            {t("noAccount")} <a href="/register">{t("register")}</a>
          </p>
          <LanguageSelector />
        </footer>
      </section>
    </main>
  );
}

export default Login;