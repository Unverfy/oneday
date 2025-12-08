import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GeminiService } from '../utils/gemini';

const InputSection: React.FC = () => {
  const { setLoading, setGeneratedPlan, setError, user } = useApp();
  const [userInput, setUserInput] = useState('');

  const generateDayPlan = async () => {
    if (!userInput.trim()) {
      setError('Будь ласка, опишіть свій день.');
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
      
      // Передаємо інтереси користувача до ШІ
      const userInterests = user?.interests || [];
      const userBudget = user?.budget;
      const userCompany = user?.company;
      
      console.log('👤 User interests:', userInterests);
      console.log('💰 User budget:', userBudget);
      console.log('👥 User company:', userCompany);
      
      const aiPlan = await geminiService.generatePlan(userInput, userInterests, userBudget, userCompany);
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
      
      <button className="generate-btn" onClick={generateDayPlan}>
        <i className="fas fa-magic"></i>
        <span>Створити ідеальний день</span>
      </button>
    </div>
  );
};

export default InputSection;
