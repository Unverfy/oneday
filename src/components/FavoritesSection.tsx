import React from 'react';
import { useApp } from '../context/AppContext';

const FavoritesSection: React.FC = () => {
  const { favoriteLocations, removeFromFavorites } = useApp();

  if (favoriteLocations.length === 0) {
    return (
      <div className="favorites-section">
        <div className="favorites-empty">
          <i className="fas fa-heart"></i>
          <h3>Улюблених місць поки немає</h3>
          <p>Додайте місця до улюблених, натиснувши на сердечко біля будь-якої активності</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-section">
      <div className="favorites-header">
        <h3>Улюблені місця</h3>
        <span className="favorites-count">{favoriteLocations.length}</span>
      </div>
      
      <div className="favorites-list">
        {favoriteLocations.map((favorite) => (
          <div key={favorite.id} className="favorite-item">
            <div className="favorite-content">
              <div className="favorite-time">{favorite.time}</div>
              <div className="favorite-title">{favorite.title}</div>
              <div className="favorite-description">{favorite.description}</div>
              <div className="favorite-location">
                <i className="fas fa-map-marker-alt"></i>
                <span>{favorite.location}</span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(favorite.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-link-btn"
                  title="Відкрити в Google Maps"
                  style={{ marginLeft: '8px', color: '#4a90e2', textDecoration: 'none', transition: 'color 0.2s', fontSize: '1.3em' }}
                >
                  <i className="fas fa-map-marked-alt"></i>
                </a>
              </div>
              <div className="favorite-date">
                Додано: {favorite.addedAt.toLocaleDateString('uk-UA')}
              </div>
            </div>
            <button 
              className="remove-favorite-btn"
              onClick={() => removeFromFavorites(favorite.id)}
              title="Видалити з улюблених"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesSection;
