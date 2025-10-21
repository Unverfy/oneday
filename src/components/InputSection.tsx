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
      console.log('📝 User input:', userInput);
      
      // Always try Gemini AI first
      const geminiService = GeminiService.getInstance();
      console.log('🔧 Gemini service instance created');
      
      const aiPlan = await geminiService.generatePlan(userInput);
      console.log('📥 AI plan result:', aiPlan);
      
      if (aiPlan && aiPlan.activities && aiPlan.activities.length > 0) {
        console.log('✅ AI plan generated successfully!');
        console.log('📋 Plan title:', aiPlan.title);
        console.log('📋 Activities count:', aiPlan.activities.length);
        setGeneratedPlan(aiPlan);
        return;
      }

      console.log('❌ AI generation failed');
      setError('AI не працює зараз. Спробуйте пізніше або перевірте налаштування API ключа.');

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
        placeholder="Опиши свої побажання для ідеального дня..."
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
