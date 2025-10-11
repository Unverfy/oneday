import { ThemeOption, DayTypeOption } from '../types';

export const GEMINI_API_KEY = 'AIzaSyBlgKaDg6-ZRS1WLJ8AWaz5RoEXDw650Fo';

export const THEME_OPTIONS: ThemeOption[] = [
  { value: 'relax', label: 'Розслаблення', icon: '🌅' },
  { value: 'productive', label: 'Продуктивність', icon: '⚡' },
  { value: 'romantic', label: 'Романтика', icon: '💕' },
  { value: 'adventure', label: 'Пригоди', icon: '🗺️' },
  { value: 'detox', label: 'Цифровий детокс', icon: '📱' },
  { value: 'cultural', label: 'Культура', icon: '🎭' }
];

export const DAY_TYPE_OPTIONS: DayTypeOption[] = [
  { value: 'weekend', label: 'Вихідний', icon: '🎉' },
  { value: 'workday', label: 'Робочий', icon: '💼' },
  { value: 'vacation', label: 'Відпустка', icon: '✈️' }
];

export const THEME_LABELS = {
  relax: '🌅 День розслаблення',
  productive: '⚡ Продуктивний день',
  romantic: '💕 Романтичний день',
  adventure: '🗺️ День пригод',
  detox: '📱 Цифровий детокс',
  cultural: '🎭 Культурний день'
};

export const DAY_TYPE_LABELS = {
  weekend: 'Вихідний',
  workday: 'Робочий день',
  vacation: 'Відпустка'
};

export const LOCATION_LABELS = {
  kyiv: 'Київ',
  lviv: 'Львів',
  odesa: 'Одеса',
  home: 'Дома'
};
