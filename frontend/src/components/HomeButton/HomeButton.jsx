import "./HomeButton.css";
import { useState, useRef, useEffect } from "react";

export default function HomeButton({ currentOption, options, onChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`home-button-container ${showDropdown ? "show-dropdown" : ""}`} ref={dropdownRef}>
      <button className="home-button" onClick={toggleDropdown}>

        <img 
          src={currentOption.flag} 
          alt="" 
          className="button-flag" 
          aria-hidden="true"
        />

        <span className="button-text">{currentOption.label}</span>
        <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {showDropdown && (
        <div className="home-button-dropdown">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setShowDropdown(false);
              }}
              className={`dropdown-item ${currentOption.value === option.value ? "active" : ""}`}
            >
              <img 
                src={option.flag} 
                alt="" 
                className="dropdown-flag" 
                aria-hidden="true"
              />
              <span className="dropdown-text">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}