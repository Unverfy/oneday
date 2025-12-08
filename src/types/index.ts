// Типи для OneDay додатку

export interface Activity {
  time: string;
  title: string;
  description: string;
  location: string;
}

export interface DayPlan {
  title: string;
  subtitle: string;
  activities: Activity[];
}

export interface SelectedOptions {
  theme: ThemeType | null;
  dayType: DayType | null;
}

export type ThemeType = 'relax' | 'productive' | 'romantic' | 'adventure' | 'detox' | 'cultural';

export type DayType = 'weekend' | 'workday' | 'vacation';

export type Theme = 'light' | 'dark';

export interface ThemeOption {
  value: ThemeType;
  label: string;
  icon: string;
}

export interface DayTypeOption {
  value: DayType;
  label: string;
  icon: string;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface FavoriteLocation {
  id: string;
  title: string;
  description: string;
  location: string;
  time: string;
  addedAt: Date;
}

export interface User {
  login: string;
  email: string;
  password: string;
  interests?: string[];
  budget?: string;
  company?: string;
}

export interface AppState {
  currentTheme: Theme;
  selectedOptions: SelectedOptions;
  isLoading: boolean;
  generatedPlan: DayPlan | null;
  error: string | null;
  favoriteLocations: FavoriteLocation[];
  isAuthenticated: boolean;
  user: User | null;
}

export type AppAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_SELECTED_OPTIONS'; payload: SelectedOptions }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_GENERATED_PLAN'; payload: DayPlan | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TO_FAVORITES'; payload: FavoriteLocation }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'SET_FAVORITES'; payload: FavoriteLocation[] }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'RESET_APP' };
