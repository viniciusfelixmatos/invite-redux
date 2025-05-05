import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./LanguageSelector.css";

const languages = {
  en: { name: "English", flag: "/flags/gb.svg" },
  pt: { name: "Português", flag: "/flags/br.svg" },
};

const LanguageSelector = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setShowDropdown(false);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = i18n.language in languages ? i18n.language : "en";

  return (
    <div className={`language-selector ${className}`} ref={dropdownRef}>
      <button className="language-button" onClick={toggleDropdown}>
        <img
          src={languages[currentLang].flag}
          alt={`${languages[currentLang].name} flag`}
          className="flag-icon"
        />
        <span>{languages[currentLang].name}</span>
      </button>

      {showDropdown && (
        <div className="language-dropdown">
          {Object.entries(languages).map(([code, { name, flag }]) => (
            <button
              key={code}
              onClick={() => changeLanguage(code)}
              className={`dropdown-item ${currentLang === code ? "active" : ""}`}
            >
              <img src={flag} alt={`${name} flag`} className="flag-icon" />
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
