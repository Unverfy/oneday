import React, { useState } from 'react';

interface AuthFormProps {
  onAuth: (userData: { login: string; email: string; password: string }) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.login.trim()) {
      newErrors.login = 'Логін обов\'язковий';
    } else if (formData.login.length < 3) {
      newErrors.login = 'Логін має бути мінімум 3 символи';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Пошта обов\'язкова';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Невірний формат пошти';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обов\'язковий';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль має бути мінімум 6 символів';
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Підтвердження пароля обов\'язкове';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Паролі не співпадають';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAuth({
        login: formData.login,
        email: formData.email,
        password: formData.password
      });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      login: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="auth-container">
      {/* Hero Section */}
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-hero-text">
            <h1 className="auth-hero-title">
              Створи свій <span className="gradient-text">ідеальний день</span>
            </h1>
            <p className="auth-hero-subtitle">
              Персоналізовані плани дня, створені з урахуванням твоїх побажань та налаштувань
            </p>
            <div className="auth-hero-features">
              <div className="auth-feature-item">
                <i className="fas fa-robot"></i> AI-генерація
              </div>
              <div className="auth-feature-item">
                <i className="fas fa-heart"></i> Улюблені місця
              </div>
              <div className="auth-feature-item">
                <i className="fas fa-palette"></i> Персоналізація
              </div>
            </div>
          </div>
          <div className="auth-hero-visual">
            <div className="auth-floating-card card-1">
              <i className="fas fa-book"></i> Навчання
            </div>
            <div className="auth-floating-card card-2">
              <i className="fas fa-coffee"></i> Кава
            </div>
            <div className="auth-floating-card card-3">
              <i className="fas fa-running"></i> Спорт
            </div>
            <div className="auth-floating-card card-4">
              <i className="fas fa-utensils"></i> Їжа
            </div>
          </div>
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {isLogin ? 'Вхід' : 'Реєстрація'}
          </h1>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Увійдіть у свій акаунт' 
              : 'Створіть новий акаунт для доступу до OneDay'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login" className="form-label">
              <i className="fas fa-user"></i>
              Логін
            </label>
            <input
              type="text"
              id="login"
              name="login"
              value={formData.login}
              onChange={handleInputChange}
              className={`form-input ${errors.login ? 'error' : ''}`}
              placeholder="Введіть ваш логін"
            />
            {errors.login && <span className="error-message">{errors.login}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <i className="fas fa-envelope"></i>
              Пошта
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Введіть вашу пошту"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <i className="fas fa-lock"></i>
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Введіть ваш пароль"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <i className="fas fa-lock"></i>
                Підтвердити пароль
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Підтвердіть ваш пароль"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          )}

          <button type="submit" className="auth-btn">
            <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
            {isLogin ? 'Увійти' : 'Зареєструватися'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? 'Немає акаунта?' : 'Вже є акаунт?'}
            <button type="button" onClick={toggleMode} className="auth-toggle">
              {isLogin ? 'Зареєструватися' : 'Увійти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
