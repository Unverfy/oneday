import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const { currentTheme, setTheme } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Handle Escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  return (
    <>
      {/* Theme Toggle */}
      <div className="theme-toggle" onClick={toggleTheme}>
        <i className={`fas ${currentTheme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
      </div>

      {/* Header */}
      <header className="header">
        <button className="settings-btn" onClick={openSidebar}>
          <i className="fas fa-cog"></i>
        </button>
        <h1>OneDay</h1>
        <p className="subtitle">Генератор ідеального дня для тебе</p>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <h2>Налаштування</h2>
          <button className="close-btn" onClick={closeSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="menu-section">
          <h3>Акаунт</h3>
          <div className="account-options">
            <button className="account-btn">
              <i className="fas fa-user"></i>
              Профіль
            </button>
            <button className="account-btn">
              <i className="fas fa-history"></i>
              Історія планів
            </button>
            <button className="account-btn">
              <i className="fas fa-heart"></i>
              Улюблені місця
            </button>
          </div>
        </div>

        <div className="menu-section">
          <h3>Налаштування</h3>
          <div className="settings-options">
            <button className="settings-btn">
              <i className="fas fa-bell"></i>
              Сповіщення
            </button>
            <button className="settings-btn">
              <i className="fas fa-language"></i>
              Мова
            </button>
            <button className="settings-btn">
              <i className="fas fa-map-marker-alt"></i>
              Місцезнаходження
            </button>
            <button className="settings-btn">
              <i className="fas fa-cog"></i>
              Загальні налаштування
            </button>
          </div>
        </div>

        <div className="menu-section">
          <h3>Допомога</h3>
          <div className="help-options">
            <button className="help-btn">
              <i className="fas fa-question-circle"></i>
              FAQ
            </button>
            <button className="help-btn">
              <i className="fas fa-envelope"></i>
              Зв'язатися з нами
            </button>
            <button className="help-btn">
              <i className="fas fa-info-circle"></i>
              Про додаток
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="overlay active" onClick={closeSidebar}></div>
      )}
    </>
  );
};

export default Header;
