import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import CardLayout from './components/CardLayout';
import AuthForm from './components/AuthForm';
import './App.css';

function AppContent() {
  const { currentTheme, setTheme, isAuthenticated, login } = useApp();

  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('oneday-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []); // Remove setTheme from dependencies to prevent infinite loop

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const handleAuth = (userData: { login: string; email: string; password: string }) => {
    login(userData);
  };

  if (!isAuthenticated) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className="app">
      <Header />
      <CardLayout />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
