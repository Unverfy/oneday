import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import InputSection from './components/InputSection';
import PlanSection from './components/PlanSection';
import './App.css';

function AppContent() {
  const { currentTheme, setTheme } = useApp();

  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('oneday-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div className="app">
      <Header />
      <InputSection />
      <PlanSection />
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
