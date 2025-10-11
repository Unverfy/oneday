import React from 'react';
import { useApp } from '../context/AppContext';

const PlanSection: React.FC = () => {
  const { generatedPlan, error, isLoading } = useApp();

  if (isLoading) {
    return (
      <section className="plan-section">
        <div className="plan-container">
          <div className="loading-message">
            <i className="fas fa-spinner fa-spin"></i>
            <h2>Генеруємо план...</h2>
            <p>Це може зайняти кілька секунд</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="plan-section">
        <div className="plan-container">
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Помилка</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (generatedPlan) {
    const isAIGenerated = generatedPlan.title !== 'Персоналізований план дня';
    
    return (
      <section className="plan-section">
        <div className="plan-container">
          <div className="day-plan">
            <div className="plan-header">
              <h2 className="plan-title">{generatedPlan.title}</h2>
              <p className="plan-subtitle">{generatedPlan.subtitle}</p>
              {isAIGenerated && (
                <div className="ai-badge">
                  <i className="fas fa-robot"></i>
                  Згенеровано за допомогою AI
                </div>
              )}
              {!isAIGenerated && (
                <div className="custom-badge">
                  <i className="fas fa-user"></i>
                  Персоналізований план
                </div>
              )}
            </div>
            <div className="activities-list">
              {generatedPlan.activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-time">{activity.time}</div>
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-description">{activity.description}</div>
                  <div className="activity-location">
                    <i className="fas fa-map-marker-alt"></i>
                    {activity.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="plan-section">
      <div className="plan-container">
        <div className="welcome-message">
          <i className="fas fa-calendar-day"></i>
          <h2>Готовий створити твій ідеальний день?</h2>
          <p>Опиши свої побажання або вибери готові опції з меню</p>
        </div>
      </div>
    </section>
  );
};

export default PlanSection;
