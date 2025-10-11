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

export interface AppState {
  currentTheme: Theme;
  selectedOptions: SelectedOptions;
  isLoading: boolean;
  generatedPlan: DayPlan | null;
  error: string | null;
}
