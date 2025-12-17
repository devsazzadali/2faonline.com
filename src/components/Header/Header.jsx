import React, { useState } from "react";
import "./Header.css";
import { MdDarkMode, MdLightMode, MdMenu, MdClose, MdHistory, MdRefresh, MdDeleteSweep } from "react-icons/md"; 

const Header = ({ onHistoryClick, historyCount, isDarkMode, onThemeToggle, onRefresh, onClearHistory }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      <div className="header-container">
        {/* Left Side: Brand */}
        <div className="brand">
          <div className="brand-logo">🛡️</div>
          <div className="brand-name">2FAOnline.com</div>
        </div>

        {/* Center Nav: Links */}
        <nav className="desktop-nav">
          <a href="#generator">Generator</a>
          <a href="#how-to-use">How to Use</a>
          <a href="#about">About</a>
        </nav>

        {/* Right Side: Actions */}
        <div className="right-actions">
          <div className="desktop-only-buttons">
            <button className="action-btn" onClick={onHistoryClick}>
              <MdHistory size={18} /> History ({historyCount})
            </button>
            <button className="action-btn" onClick={onRefresh}>
              <MdRefresh size={18} /> Refresh
            </button>
          </div>

          <button className="theme-toggle" onClick={onThemeToggle}>
            {isDarkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
          </button>

          {/* Mobile Hamburger Icon */}
          <button className="hamburger" onClick={toggleMenu}>
            {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu (Image be87bb অনুযায়ী) */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-links">
              <a href="#generator" onClick={toggleMenu}>Generator</a>
              <a href="#how-to-use" onClick={toggleMenu}>How to Use</a>
              <a href="#about" onClick={toggleMenu}>About</a>
            </div>
            <hr />
            <div className="mobile-actions">
              <button className="mobile-btn" onClick={() => { onHistoryClick(); toggleMenu(); }}>
                <MdHistory /> History ({historyCount})
              </button>
              <button className="mobile-btn" onClick={() => { onRefresh(); toggleMenu(); }}>
                <MdRefresh /> Refresh Codes
              </button>
              <button className="mobile-btn delete-btn" onClick={() => { onClearHistory(); toggleMenu(); }}>
                <MdDeleteSweep /> Clear History
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;