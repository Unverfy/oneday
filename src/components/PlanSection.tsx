import React from 'react';
import { useApp } from '../context/AppContext';

const PlanSection: React.FC = () => {
  const { generatedPlan, error, isLoading, favoriteLocations, addToFavorites, removeFromFavorites } = useApp();

  if (isLoading) {
    return (
      <div className="plan-section-content">
        <div className="loading-message">
          <i className="fas fa-spinner fa-spin"></i>
          <h2>Генеруємо план...</h2>
          <p>Це може зайняти кілька секунд</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="plan-section-content">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Помилка</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (generatedPlan) {
    const isAIGenerated = generatedPlan.title !== 'Персоналізований план дня';
    
    return (
      <div className="plan-section-content">
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
              {generatedPlan.activities.map((activity, index) => {
                const favoriteItem = favoriteLocations.find(fav => 
                  fav.title === activity.title && 
                  fav.location === activity.location &&
                  fav.time === activity.time
                );
                const isFavorite = !!favoriteItem;
                
                const handleFavoriteClick = () => {
                  if (isFavorite && favoriteItem) {
                    removeFromFavorites(favoriteItem.id);
                  } else {
                    addToFavorites(activity);
                  }
                };
                
                return (
                  <div key={index} className="activity-item">
                    <div className="activity-time">{activity.time}</div>
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-description">{activity.description}</div>
                    <div className="activity-location">
                      <i className="fas fa-map-marker-alt"></i>
                      {activity.location}
                    </div>
                    <button 
                      className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                      onClick={handleFavoriteClick}
                      title={isFavorite ? 'Видалити з улюблених' : 'Додати до улюблених'}
                    >
                      <i className={`fas fa-heart ${isFavorite ? 'filled' : ''}`}></i>
                    </button>
                  </div>
                );
              })}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="plan-section-content">
      <div className="welcome-message">
        <i className="fas fa-calendar-day"></i>
        <h2>Готовий створити твій ідеальний день?</h2>
        <p>Опиши свої побажання або вибери готові опції з меню</p>
      </div>
    </div>
  );
};

export default PlanSection;
