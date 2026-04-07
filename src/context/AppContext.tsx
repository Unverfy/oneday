import React, { createContext, useContext, useReducer, ReactNode, Dispatch, useCallback, useEffect } from 'react';
import { AppState, Theme, SelectedOptions, DayPlan, FavoriteLocation, User, AppAction, PlanHistoryItem } from '../types';

interface AppContextType extends AppState {
  setTheme: (theme: Theme) => void;
  setSelectedOptions: (options: SelectedOptions) => void;
  setLoading: (loading: boolean) => void;
  setGeneratedPlan: (plan: DayPlan | null) => void;
  addPlanToHistory: (params: { prompt: string; plan: DayPlan }) => Promise<void>;
  deletePlanFromHistory: (id: string) => Promise<void>;
  togglePlanFavoriteInHistory: (id: string) => Promise<void>;
  setError: (error: string | null) => void;
  addToFavorites: (activity: { time: string; title: string; description: string; location: string }) => Promise<void>;
  removeFromFavorites: (id: string) => Promise<void>;
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
  planHistory: [],
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
    case 'SET_PLAN_HISTORY':
        return { ...state, planHistory: action.payload };
    case 'ADD_PLAN_HISTORY':
      return {
        ...state,
        planHistory: [action.payload, ...state.planHistory]
      };
    case 'DELETE_PLAN_HISTORY':
      return {
        ...state,
        planHistory: state.planHistory.filter(item => item.id !== action.payload)
      };
    case 'TOGGLE_PLAN_HISTORY_FAVORITE':
      return {
        ...state,
        planHistory: state.planHistory.map(item =>
          item.id === action.payload ? { ...item, isFavorite: !item.isFavorite } : item
        )
      };
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
      return { ...state, favoriteLocations: action.payload as FavoriteLocation[] };
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

const getAuthHeaders = () => {
  const token = localStorage.getItem('oneday-token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize state with user from localStorage
  const [state, dispatch] = useReducer(appReducer, initialState, () => {
    const savedUser = localStorage.getItem('oneday-user');
    const user = savedUser ? JSON.parse(savedUser) : null;

    // Load initial empty history/favorites, will fetch dynamically if logged in
    return {
      ...initialState,
      isAuthenticated: !!user,
      user: user
    };
  }) as [AppState, Dispatch<any>];

  // Fetch data cleanly automatically on load if authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (!state.isAuthenticated) return;
      
      try {
        // Fetch Favorites
        const placesRes = await fetch('/api/places', { headers: getAuthHeaders() });
        if (placesRes.ok) {
          const placesData = await placesRes.json();
          const mappedFavorites = placesData.map((fav: any) => ({
            id: fav._id,
            title: fav.title,
            description: fav.description || '',
            location: fav.location || '',
            time: fav.time || '',
            addedAt: new Date(fav.createdAt)
          }));
          dispatch({ type: 'SET_FAVORITES', payload: mappedFavorites });
        }

        // Fetch Plans
        const plansRes = await fetch('/api/plans?limit=100', { headers: getAuthHeaders() });
        if (plansRes.ok) {
          const plansData = await plansRes.json();
          // plans array usually inside data object due to our backend paginated response
          const plansArray = plansData.data || plansData; 
          const mappedPlans = plansArray.map((plan: any) => ({
            id: plan._id,
            prompt: plan.title,
            plan: plan.description ? JSON.parse(plan.description) : null,
            createdAt: plan.date,
            isFavorite: plan.status === 'completed' // Reuse status for favorite as string
          }));
          dispatch({ type: 'SET_PLAN_HISTORY', payload: mappedPlans });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [state.isAuthenticated]);

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

  const addPlanToHistory = useCallback(async (params: { prompt: string; plan: DayPlan }) => {
    try {
      if (state.isAuthenticated) {
        const res = await fetch('/api/plans', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            title: params.prompt || 'Generated Plan',
            description: JSON.stringify(params.plan),
            date: new Date().toISOString()
          })
        });

        if (res.ok) {
          const planData = await res.json();
          const newItem: PlanHistoryItem = {
            id: planData._id,
            prompt: planData.title,
            plan: JSON.parse(planData.description),
            createdAt: planData.date,
            isFavorite: false
          };
          dispatch({ type: 'ADD_PLAN_HISTORY', payload: newItem });
          return;
        }
      }
      
      // Fallback
      dispatch({ type: 'ADD_PLAN_HISTORY', payload: {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        prompt: params.prompt,
        plan: params.plan,
        createdAt: new Date().toISOString(),
        isFavorite: false
      } });
    } catch(err) {
      console.error(err);
    }
  }, [dispatch, state.isAuthenticated]);

  const deletePlanFromHistory = useCallback(async (id: string) => {
    try {
      if (state.isAuthenticated && !id.includes('-')) {
        await fetch(`/api/plans/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
      }
      dispatch({ type: 'DELETE_PLAN_HISTORY', payload: id });
    } catch(err) {
      console.error(err);
    }
  }, [dispatch, state.isAuthenticated]);

  const togglePlanFavoriteInHistory = useCallback(async (id: string) => {
    try {
      const item = state.planHistory.find(i => i.id === id);
      if (item && state.isAuthenticated && !id.includes('-')) {
        await fetch(`/api/plans/${id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            status: !item.isFavorite ? 'completed' : 'planned' // using status backend field
          })
        });
      }
      dispatch({ type: 'TOGGLE_PLAN_HISTORY_FAVORITE', payload: id });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, state.planHistory, state.isAuthenticated]);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, [dispatch]);

  const addToFavorites = useCallback(async (activity: { time: string; title: string; description: string; location: string }) => {
    try {
      if (state.isAuthenticated) {
        const res = await fetch('/api/places', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            title: activity.title,
            description: activity.description,
            location: activity.location,
            time: activity.time,
            isFavorite: true
          })
        });
        
        if (res.ok) {
          const favData = await res.json();
          dispatch({ type: 'ADD_TO_FAVORITES', payload: {
            id: favData._id,
            title: favData.title,
            description: favData.description || '',
            location: favData.location || '',
            time: favData.time || '',
            addedAt: new Date(favData.createdAt)
          }});
          return;
        }
      }

      // Fallback
      dispatch({ type: 'ADD_TO_FAVORITES', payload: {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...activity,
        addedAt: new Date()
      }});
    } catch (err) {
      console.error(err);
    }
  }, [dispatch, state.isAuthenticated]);

  const removeFromFavorites = useCallback(async (id: string) => {
    try {
      if (state.isAuthenticated && !id.includes('-')) {
        await fetch(`/api/places/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
      }
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: id });
    } catch(err) {
      console.error(err);
    }
  }, [dispatch, state.isAuthenticated]);

  const login = useCallback((userData: User) => {
    dispatch({ type: 'LOGIN', payload: userData });
    localStorage.setItem('oneday-user', JSON.stringify(userData));
  }, [dispatch]);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('oneday-user');
    localStorage.removeItem('oneday-token');
    // Clear history visually
    dispatch({ type: 'SET_PLAN_HISTORY', payload: [] });
    dispatch({ type: 'SET_FAVORITES', payload: [] });
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
    addPlanToHistory,
    deletePlanFromHistory,
    togglePlanFavoriteInHistory,
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
