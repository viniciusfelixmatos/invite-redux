import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import useRegister from "../../hooks/useRegister";
import "./Register.css";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/LanguageSelector/LanguageSelector";

function Register() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const { register, error, successMessage } = useRegister();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(login, password, username);
        if (success) {
            setLogin("");
            setPassword("");
            setUsername("");
        }
    };

    return (
        <main className="register-content d-flex">
            <section className="section-intro d-flex flex-column">
                <div className="section-intro-content text-center">
                    <h1>{t("welcome")}</h1>
                    <hr className="section-divider" />
                    <h2 className="section-subtitle">{t("subtitle")}</h2>
                </div>
            </section>

            <section className="section-register">
                <header>
                    <h1>{t("registerTitle")}</h1>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="form-content">
                        <div>
                            <input
                                type="text"
                                id="username"
                                placeholder={t("usernamePlaceholder")}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                id="login"
                                placeholder={t("loginPlaceholder")}
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                id="password"
                                placeholder={t("passwordPlaceholder")}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="alert alert-danger text-center">{error}</p>}
                        {successMessage && (
                            <p className="alert alert-success text-center">{successMessage}</p>
                        )}

                        <div className="d-grid">
                            <button type="submit">{t("register")}</button>
                        </div>
                    </div>
                </form>

                <footer>
                    <p>
                        {t("alreadyHaveAccount")} <a href="/">{t("login")}</a>
                    </p>

                    <LanguageSelector />
                </footer>
            </section>
        </main>
    );
}

export default Register;
