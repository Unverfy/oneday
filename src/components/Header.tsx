import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import FavoritesSection from './FavoritesSection';

const Header: React.FC = () => {
  const { currentTheme, setTheme, user, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favoritesModalOpen, setFavoritesModalOpen] = useState(false);

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

  const openFavoritesModal = () => {
    setFavoritesModalOpen(true);
    setSidebarOpen(false); // Close sidebar when opening favorites
  };

  const closeFavoritesModal = () => {
    setFavoritesModalOpen(false);
  };

  // Handle Escape key to close sidebar and favorites modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (favoritesModalOpen) {
          closeFavoritesModal();
        } else if (sidebarOpen) {
          closeSidebar();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen, favoritesModalOpen]);

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
            <button className="account-btn" onClick={openFavoritesModal}>
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

        <div className="menu-section">
          <h3>Акаунт</h3>
          <div className="account-info">
            <div className="user-info">
              <i className="fas fa-user-circle"></i>
              <div>
                <div className="user-name">{user?.login}</div>
                <div className="user-email">{user?.email}</div>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              <i className="fas fa-sign-out-alt"></i>
              Вийти
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="overlay active" onClick={closeSidebar}></div>
      )}

      {/* Favorites Modal */}
      {favoritesModalOpen && (
        <div className="favorites-modal-overlay" onClick={closeFavoritesModal}>
          <div className="favorites-modal" onClick={(e) => e.stopPropagation()}>
            <div className="favorites-modal-header">
              <h2>Улюблені місця</h2>
              <button className="close-btn" onClick={closeFavoritesModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="favorites-modal-content">
              <FavoritesSection />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
