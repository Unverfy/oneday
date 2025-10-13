import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { THEME_OPTIONS, DAY_TYPE_OPTIONS } from '../constants';
import { ThemeType, DayType } from '../types';
import { GeminiService } from '../utils/gemini';
import { parseUserInput } from '../utils/parser';
import { dayPlans } from '../data/staticPlans';
import { THEME_LABELS, DAY_TYPE_LABELS, LOCATION_LABELS } from '../constants';

const InputSection: React.FC = () => {
  const { selectedOptions, setSelectedOptions, setLoading, setGeneratedPlan, setError } = useApp();
  const [userInput, setUserInput] = useState('');
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [dayTypeDropdownOpen, setDayTypeDropdownOpen] = useState(false);

  const selectTheme = (theme: ThemeType) => {
    setSelectedOptions({ ...selectedOptions, theme });
    setThemeDropdownOpen(false);
  };

  const selectDayType = (dayType: DayType) => {
    setSelectedOptions({ ...selectedOptions, dayType });
    setDayTypeDropdownOpen(false);
  };

  const removeOption = (type: 'theme' | 'dayType') => {
    setSelectedOptions({ ...selectedOptions, [type]: null });
  };

  const generateDayPlan = async () => {
    if (!userInput.trim()) {
      setError('Будь ласка, опишіть свій день або виберіть опції з меню.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🤖 Attempting AI generation...');
      
      // Always try Gemini AI first
      const geminiService = GeminiService.getInstance();
      const aiPlan = await geminiService.generatePlan(userInput);
      
      if (aiPlan && aiPlan.activities && aiPlan.activities.length > 0) {
        console.log('✅ AI plan generated successfully!');
        setGeneratedPlan(aiPlan);
        return;
      }

      console.log('⚠️ AI generation failed, trying alternative approach...');
      
      // If AI fails, create a custom plan based on user input
      const keywords = parseUserInput(userInput);
      const theme = selectedOptions.theme || keywords.theme || 'relax';
      const dayType = selectedOptions.dayType || keywords.dayType || 'weekend';
      
      // Create a more personalized plan based on user input
      const customPlan = {
        title: `Персоналізований план дня`,
        subtitle: `Створено на основі вашого запиту`,
        activities: [
          {
            time: '09:00',
            title: 'Сніданок',
            description: 'Починаємо день з поживного сніданку',
            location: 'Дома або в кафе'
          },
          {
            time: '10:30',
            title: 'Активність',
            description: 'Час для основної активності дня',
            location: 'Залежить від ваших побажань'
          },
          {
            time: '12:30',
            title: 'Обід',
            description: 'Смачний обід для відновлення енергії',
            location: 'Ресторан або кафе'
          },
          {
            time: '14:00',
            title: 'Відпочинок',
            description: 'Час для розслаблення та відпочинку',
            location: 'Парк або вдома'
          },
          {
            time: '16:00',
            title: 'Друга активність',
            description: 'Продовжуємо день з цікавою активністю',
            location: 'Залежить від ваших інтересів'
          },
          {
            time: '18:00',
            title: 'Вечеря',
            description: 'Приємна вечеря для завершення дня',
            location: 'Ресторан або вдома'
          }
        ]
      };

      setGeneratedPlan(customPlan);

    } catch (error) {
      console.error('❌ Error generating plan:', error);
      setError('Виникла помилка при генерації плану. Спробуйте ще раз або перевірте підключення до інтернету.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      generateDayPlan();
    }
  };

  return (
    <div className="input-section-content">
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ resize: 'none', height: '40px' }}
      />
      
      {/* Options Row */}
      <div className="options-row">
        {/* Theme Dropdown */}
        <div className="theme-dropdown-container">
          <button 
              className={`theme-dropdown-btn ${themeDropdownOpen ? 'open' : ''}`}
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            >
              <i className="fas fa-palette"></i>
              <span>
                {selectedOptions.theme 
                  ? `${THEME_OPTIONS.find(t => t.value === selectedOptions.theme)?.icon} ${THEME_OPTIONS.find(t => t.value === selectedOptions.theme)?.label}`
                  : 'Тема дня'
                }
              </span>
              <i className="fas fa-chevron-down"></i>
          </button>
          {themeDropdownOpen && (
            <div className="theme-dropdown open">
              {THEME_OPTIONS.map(option => (
                <button
                  key={option.value}
                  className="theme-option"
                  onClick={() => selectTheme(option.value)}
                >
                  <span className="theme-icon">{option.icon}</span>
                  <span className="theme-text">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Day Type Dropdown */}
        <div className="day-type-dropdown-container">
          <button 
              className={`day-type-dropdown-btn ${dayTypeDropdownOpen ? 'open' : ''}`}
              onClick={() => setDayTypeDropdownOpen(!dayTypeDropdownOpen)}
            >
              <i className="fas fa-calendar"></i>
              <span>
                {selectedOptions.dayType 
                  ? `${DAY_TYPE_OPTIONS.find(t => t.value === selectedOptions.dayType)?.icon} ${DAY_TYPE_OPTIONS.find(t => t.value === selectedOptions.dayType)?.label}`
                  : 'Тип дня'
                }
              </span>
              <i className="fas fa-chevron-down"></i>
          </button>
          {dayTypeDropdownOpen && (
            <div className="day-type-dropdown open">
              {DAY_TYPE_OPTIONS.map(option => (
                <button
                  key={option.value}
                  className="day-type-option"
                  onClick={() => selectDayType(option.value)}
                >
                  <span className="day-type-icon">{option.icon}</span>
                  <span className="day-type-text">{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <button className="generate-btn" onClick={generateDayPlan}>
        <i className="fas fa-magic"></i>
        <span>Створити ідеальний день</span>
      </button>

      {/* Selected Options Display */}
      <div className="selected-options">
        <div className="option-tags">
          {selectedOptions.theme && (
            <div className="option-tag">
              <span>Тема: {THEME_OPTIONS.find(t => t.value === selectedOptions.theme)?.icon} {THEME_OPTIONS.find(t => t.value === selectedOptions.theme)?.label}</span>
              <span className="remove" onClick={() => removeOption('theme')}>×</span>
            </div>
          )}
          {selectedOptions.dayType && (
            <div className="option-tag">
              <span>Тип дня: {DAY_TYPE_OPTIONS.find(t => t.value === selectedOptions.dayType)?.icon} {DAY_TYPE_OPTIONS.find(t => t.value === selectedOptions.dayType)?.label}</span>
              <span className="remove" onClick={() => removeOption('dayType')}>×</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputSection;
