import React from 'react';
import { useApp } from '../context/AppContext';

const HeroSection: React.FC = () => {
  const { currentTheme } = useApp();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Створи свій
            <span className="gradient-text"> ідеальний день</span>
          </h1>
          <p className="hero-subtitle">
            Персоналізовані плани дня, створені з урахуванням твоїх побажань та налаштувань
          </p>
          <div className="hero-features">
            <div className="feature-item">
              <i className="fas fa-magic"></i>
              <span>AI-генерація</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-heart"></i>
              <span>Улюблені місця</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-palette"></i>
              <span>Персоналізація</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <i className="fas fa-coffee"></i>
            <span>Кава</span>
          </div>
          <div className="floating-card card-2">
            <i className="fas fa-utensils"></i>
            <span>Їжа</span>
          </div>
          <div className="floating-card card-3">
            <i className="fas fa-running"></i>
            <span>Спорт</span>
          </div>
          <div className="floating-card card-4">
            <i className="fas fa-book"></i>
            <span>Навчання</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
