import { ThemeType, DayType } from '../types';

export interface ParsedKeywords {
  theme: ThemeType | null;
  dayType: DayType | null;
}

export function parseUserInput(text: string): ParsedKeywords {
  const keywords: ParsedKeywords = {
    theme: null,
    dayType: null
  };

  const lowerText = text.toLowerCase();

  // Theme keywords
  if (lowerText.includes('розслабитися') || lowerText.includes('відпочити')) {
    keywords.theme = 'relax';
  } else if (lowerText.includes('продуктивний') || lowerText.includes('робота')) {
    keywords.theme = 'productive';
  } else if (lowerText.includes('романтичний') || lowerText.includes('романтика')) {
    keywords.theme = 'romantic';
  } else if (lowerText.includes('пригоди') || lowerText.includes('активний')) {
    keywords.theme = 'adventure';
  } else if (lowerText.includes('детокс') || lowerText.includes('цифровий')) {
    keywords.theme = 'detox';
  } else if (lowerText.includes('культура') || lowerText.includes('музей')) {
    keywords.theme = 'cultural';
  }

  // Day type keywords
  if (lowerText.includes('вихідний') || lowerText.includes('вихідні')) {
    keywords.dayType = 'weekend';
  } else if (lowerText.includes('робочий') || lowerText.includes('робота')) {
    keywords.dayType = 'workday';
  } else if (lowerText.includes('відпустка') || lowerText.includes('відпустку')) {
    keywords.dayType = 'vacation';
  }

  return keywords;
}
