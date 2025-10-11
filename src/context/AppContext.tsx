import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Theme, SelectedOptions, DayPlan } from '../types';

interface AppContextType extends AppState {
  setTheme: (theme: Theme) => void;
  setSelectedOptions: (options: SelectedOptions) => void;
  setLoading: (loading: boolean) => void;
  setGeneratedPlan: (plan: DayPlan | null) => void;
  setError: (error: string | null) => void;
  resetApp: () => void;
}

type AppAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_SELECTED_OPTIONS'; payload: SelectedOptions }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_GENERATED_PLAN'; payload: DayPlan | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_APP' };

const initialState: AppState = {
  currentTheme: 'light',
  selectedOptions: {
    theme: null,
    dayType: null
  },
  isLoading: false,
  generatedPlan: null,
  error: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, currentTheme: action.payload };
    case 'SET_SELECTED_OPTIONS':
      return { ...state, selectedOptions: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_GENERATED_PLAN':
      return { ...state, generatedPlan: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_APP':
      return initialState;
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setTheme = (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    localStorage.setItem('oneday-theme', theme);
  };

  const setSelectedOptions = (options: SelectedOptions) => {
    dispatch({ type: 'SET_SELECTED_OPTIONS', payload: options });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setGeneratedPlan = (plan: DayPlan | null) => {
    dispatch({ type: 'SET_GENERATED_PLAN', payload: plan });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const resetApp = () => {
    dispatch({ type: 'RESET_APP' });
  };

  const value: AppContextType = {
    ...state,
    setTheme,
    setSelectedOptions,
    setLoading,
    setGeneratedPlan,
    setError,
    resetApp
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
