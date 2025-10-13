import React, { createContext, useContext, useReducer, ReactNode, Dispatch, useCallback } from 'react';
import { AppState, Theme, SelectedOptions, DayPlan, FavoriteLocation, User, AppAction } from '../types';

interface AppContextType extends AppState {
  setTheme: (theme: Theme) => void;
  setSelectedOptions: (options: SelectedOptions) => void;
  setLoading: (loading: boolean) => void;
  setGeneratedPlan: (plan: DayPlan | null) => void;
  setError: (error: string | null) => void;
  addToFavorites: (activity: { time: string; title: string; description: string; location: string }) => void;
  removeFromFavorites: (id: string) => void;
  login: (userData: User) => void;
  logout: () => void;
  resetApp: () => void;
}

const initialState: AppState = {
  currentTheme: 'light',
  selectedOptions: {
    theme: null,
    dayType: null
  },
  isLoading: false,
  generatedPlan: null,
  error: null,
  favoriteLocations: [],
  isAuthenticated: false,
  user: null
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
    case 'ADD_TO_FAVORITES':
      return { 
        ...state, 
        favoriteLocations: [...state.favoriteLocations, action.payload]
      };
    case 'REMOVE_FROM_FAVORITES':
      return { 
        ...state, 
        favoriteLocations: state.favoriteLocations.filter(fav => fav.id !== action.payload)
      };
    case 'SET_FAVORITES':
      return { ...state, favoriteLocations: action.payload };
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    case 'RESET_APP':
      return initialState;
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize state with favorites and user from localStorage
  const [state, dispatch] = useReducer(appReducer, initialState, () => {
    const savedFavorites = localStorage.getItem('oneday-favorites');
    const savedUser = localStorage.getItem('oneday-user');
    
    const favorites = savedFavorites ? JSON.parse(savedFavorites).map((fav: any) => ({
      ...fav,
      addedAt: new Date(fav.addedAt)
    })) : [];

    const user = savedUser ? JSON.parse(savedUser) : null;

    return {
      ...initialState,
      favoriteLocations: favorites,
      isAuthenticated: !!user,
      user: user
    };
  }) as [AppState, Dispatch<AppAction>];

  const setTheme = useCallback((theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    localStorage.setItem('oneday-theme', theme);
  }, [dispatch]);

  const setSelectedOptions = useCallback((options: SelectedOptions) => {
    dispatch({ type: 'SET_SELECTED_OPTIONS', payload: options });
  }, [dispatch]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [dispatch]);

  const setGeneratedPlan = useCallback((plan: DayPlan | null) => {
    dispatch({ type: 'SET_GENERATED_PLAN', payload: plan });
  }, [dispatch]);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, [dispatch]);

  const addToFavorites = useCallback((activity: { time: string; title: string; description: string; location: string }) => {
    const favoriteLocation: FavoriteLocation = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: activity.title,
      description: activity.description,
      location: activity.location,
      time: activity.time,
      addedAt: new Date()
    };
    
    dispatch({ type: 'ADD_TO_FAVORITES', payload: favoriteLocation });
    
    // Save to localStorage
    const updatedFavorites = [...state.favoriteLocations, favoriteLocation];
    localStorage.setItem('oneday-favorites', JSON.stringify(updatedFavorites));
  }, [dispatch, state.favoriteLocations]);

  const removeFromFavorites = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: id });
    
    // Update localStorage
    const updatedFavorites = state.favoriteLocations.filter((fav: FavoriteLocation) => fav.id !== id);
    localStorage.setItem('oneday-favorites', JSON.stringify(updatedFavorites));
  }, [dispatch, state.favoriteLocations]);

  const login = useCallback((userData: User) => {
    dispatch({ type: 'LOGIN', payload: userData });
    // Save user data to localStorage
    localStorage.setItem('oneday-user', JSON.stringify(userData));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    // Remove user data from localStorage
    localStorage.removeItem('oneday-user');
  }, [dispatch]);

  const resetApp = useCallback(() => {
    dispatch({ type: 'RESET_APP' });
  }, [dispatch]);

  const value: AppContextType = {
    ...state,
    setTheme,
    setSelectedOptions,
    setLoading,
    setGeneratedPlan,
    setError,
    addToFavorites,
    removeFromFavorites,
    login,
    logout,
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
