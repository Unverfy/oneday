import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import FavoritesSection from './FavoritesSection';

const Header: React.FC = () => {
  const { 
    currentTheme, 
    setTheme, 
    user, 
    logout, 
    login,
    planHistory,
    deletePlanFromHistory,
    togglePlanFavoriteInHistory,
    setGeneratedPlan
  } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favoritesModalOpen, setFavoritesModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [historyTab, setHistoryTab] = useState<'all' | 'favorites'>('all');
  
  // Interests state
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  const [selectedBudget, setSelectedBudget] = useState<string>(user?.budget || '');
  const [selectedCompany, setSelectedCompany] = useState<string>(user?.company || '');

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const openFavoritesModal = () => {
    setFavoritesModalOpen(true);
    setSidebarOpen(false);
  };

  const closeFavoritesModal = () => {
    setFavoritesModalOpen(false);
  };

  const openProfileModal = () => {
    setProfileModalOpen(true);
    setSidebarOpen(false);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
  };

  const openEditProfileModal = () => {
    setEditProfileModalOpen(true);
    setProfileModalOpen(false);
  };

  const closeEditProfileModal = () => {
    setEditProfileModalOpen(false);
  };

  const openInterestsModal = () => {
    setInterestsModalOpen(true);
    setProfileModalOpen(false);
    setSidebarOpen(false);
  };

  const closeInterestsModal = () => {
    setInterestsModalOpen(false);
  };

  const openHistoryModal = () => {
    setHistoryModalOpen(true);
    setSidebarOpen(false);
  };

  const closeHistoryModal = () => {
    setHistoryModalOpen(false);
  };

  const openAboutModal = () => {
    setAboutModalOpen(true);
    setSidebarOpen(false);
  };

  const closeAboutModal = () => {
    setAboutModalOpen(false);
  };

  const openFaqModal = () => {
    setFaqModalOpen(true);
    setSidebarOpen(false);
  };

  const closeFaqModal = () => {
    setFaqModalOpen(false);
  };

  const openContactModal = () => {
    setContactModalOpen(true);
    setSidebarOpen(false);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
  };

  const openChangePasswordModal = () => {
    setChangePasswordModalOpen(true);
    setProfileModalOpen(false);
  };

  const closeChangePasswordModal = () => {
    setChangePasswordModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    setProfileModalOpen(false);
  };

  // Load interests when modal opens or user changes
  useEffect(() => {
    if (user) {
      setSelectedInterests(user.interests || []);
      setSelectedBudget(user.budget || '');
      setSelectedCompany(user.company || '');
    }
  }, [user]);
  
  // Also update when interests modal opens
  useEffect(() => {
    if (interestsModalOpen && user) {
      setSelectedInterests(user.interests || []);
      setSelectedBudget(user.budget || '');
      setSelectedCompany(user.company || '');
    }
  }, [interestsModalOpen, user]);

  const handleInterestChange = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSaveInterests = () => {
    if (user) {
      const updatedUser = {
        ...user,
        interests: selectedInterests,
        budget: selectedBudget,
        company: selectedCompany
      };
      
      console.log('💾 Saving interests:', {
        interests: selectedInterests,
        budget: selectedBudget,
        company: selectedCompany
      });
      
      // Зберігаємо інтереси
      login(updatedUser);
      
      // Перевірка збереження в localStorage
      const savedUser = localStorage.getItem('oneday-user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        console.log('✅ Interests saved to localStorage:', {
          interests: parsed.interests,
          budget: parsed.budget,
          company: parsed.company
        });
        
        // Перевірка, що дані правильно збережені
        if (parsed.interests && parsed.interests.length > 0) {
          console.log('✅ Interests successfully saved:', parsed.interests);
        }
      }
      
      closeInterestsModal();
    } else {
      console.error('❌ Cannot save interests: user is null');
    }
  };

  // Handle Escape key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (changePasswordModalOpen) {
          closeChangePasswordModal();
        } else if (contactModalOpen) {
          closeContactModal();
        } else if (faqModalOpen) {
          closeFaqModal();
        } else if (aboutModalOpen) {
          closeAboutModal();
        } else if (historyModalOpen) {
          closeHistoryModal();
        } else if (interestsModalOpen) {
          closeInterestsModal();
        } else if (editProfileModalOpen) {
          closeEditProfileModal();
        } else if (profileModalOpen) {
          closeProfileModal();
        } else if (favoritesModalOpen) {
          closeFavoritesModal();
        } else if (sidebarOpen) {
          closeSidebar();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen, favoritesModalOpen, profileModalOpen, editProfileModalOpen, interestsModalOpen, historyModalOpen, aboutModalOpen, faqModalOpen, contactModalOpen, changePasswordModalOpen]);

  return (
    <>
      {/* Theme Toggle */}
      <div className="theme-toggle" onClick={toggleTheme}>
        <i className={`fas ${currentTheme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
      </div>

      {/* Header */}
      <header className="header">
        <button className="settings-btn" onClick={openSidebar}>
          <i className="fas fa-cog"></i>
        </button>
        <h1>OneDay</h1>
        <p className="subtitle">Генератор ідеального дня для тебе</p>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <h2>Налаштування</h2>
          <button className="close-btn" onClick={closeSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="menu-section">
          <h3>Акаунт</h3>
          <div className="account-options">
            <button className="account-btn" onClick={openProfileModal}>
              <i className="fas fa-user"></i>
              Профіль
            </button>
            <button className="account-btn" onClick={openHistoryModal}>
              <i className="fas fa-history"></i>
              Історія планів
            </button>
            <button className="account-btn" onClick={openFavoritesModal}>
              <i className="fas fa-heart"></i>
              Улюблені місця
            </button>
            <button className="account-btn" onClick={openInterestsModal}>
              <i className="fas fa-tags"></i>
              Мої інтереси
            </button>
          </div>
        </div>

        {/* User Interests Display in Sidebar */}
        {user?.interests && user.interests.length > 0 && (
          <div className="menu-section">
            <h3>Ваші інтереси</h3>
            <div className="sidebar-interests">
              {user.interests.map((interest, index) => (
                <span key={index} className="sidebar-interest-tag">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="menu-section">
          <h3>Допомога</h3>
          <div className="help-options">
            <button className="help-btn" onClick={openFaqModal}>
              <i className="fas fa-question-circle"></i>
              FAQ
            </button>
            <button className="help-btn" onClick={openContactModal}>
              <i className="fas fa-envelope"></i>
              Зв'язатися з нами
            </button>
            <button className="help-btn" onClick={openAboutModal}>
              <i className="fas fa-info-circle"></i>
              Про додаток
            </button>
          </div>
        </div>

      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="overlay active" onClick={closeSidebar}></div>
      )}

      {/* Profile Modal */}
      {profileModalOpen && (
        <div className="profile-modal-overlay" onClick={closeProfileModal}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>Профіль користувача</h2>
              <button className="close-btn" onClick={closeProfileModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="profile-modal-content">
              <div className="profile-info">
                <div className="profile-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="profile-details">
                  <h3>{user?.login}</h3>
                  <p>{user?.email}</p>
                </div>
              </div>
              <div className="profile-actions">
                <button className="profile-action-btn" onClick={openEditProfileModal}>
                  <i className="fas fa-edit"></i>
                  Редагувати профіль
                </button>
                <button className="profile-action-btn" onClick={openChangePasswordModal}>
                  <i className="fas fa-key"></i>
                  Змінити пароль
                </button>
                <button className="profile-action-btn logout-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                  Вийти з акаунта
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {aboutModalOpen && (
        <div className="about-modal-overlay" onClick={closeAboutModal}>
          <div className="about-modal" onClick={(e) => e.stopPropagation()}>
            <div className="about-modal-header">
              <h2>Про додаток</h2>
              <button className="close-btn" onClick={closeAboutModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="about-modal-content">
              <h3>OneDay: Ваш ідеальний день, спланований штучним інтелектом</h3>
              <p>Ви коли-небудь ловили себе на думці: "Чим би сьогодні зайнятися?" або "Хочу відпочити, але не знаю, з чого почати"?</p>
              <p>OneDay — це ваш персональний помічник у плануванні дозвілля. Ми використовуємо потужність штучного інтелекту, щоб перетворити ваші абстрактні бажання на чіткий та захоплюючий план дня.</p>
              
              <h4>Як це працює?</h4>
              <p><strong>Все просто.</strong> У вас є ідея, настрій або локація?</p>
              
              <div className="about-steps">
                <div className="about-step">
                  <div className="step-icon">1️⃣</div>
                  <div className="step-content">
                    <h4>Напишіть запит</h4>
                    <p>Розкажіть нам, чого ви хочете. Наприклад: "Я у Вінниці і хочу відпочити" або "Шукаю пригоди в Києві на вихідних".</p>
                  </div>
                </div>
                
                <div className="about-step">
                  <div className="step-icon">2️⃣</div>
                  <div className="step-content">
                    <h4>Оберіть інтереси</h4>
                    <p>Позначте, що вам до вподоби — чи то мистецтво, спорт, спокійна прогулянка чи гастрономічні відкриття.</p>
                  </div>
                </div>
                
                <div className="about-step">
                  <div className="step-icon">3️⃣</div>
                  <div className="step-content">
                    <h4>Отримайте план</h4>
                    <p>Наш ШІ проаналізує ваш запит та інтереси і миттєво згенерує унікальний розклад, сповнений ідей та активностей, створених саме для вас.</p>
                  </div>
                </div>
              </div>
              
              <p className="about-conclusion">Більше не потрібно годинами шукати ідеї в інтернеті. З OneDay кожен ваш день може стати особливим. Спробуйте зараз і відкрийте для себе нові можливості!</p>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {faqModalOpen && (
        <div className="faq-modal-overlay" onClick={closeFaqModal}>
          <div className="faq-modal" onClick={(e) => e.stopPropagation()}>
            <div className="faq-modal-header">
              <h2>FAQ</h2>
              <button className="close-btn" onClick={closeFaqModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="faq-modal-content">
              <div className="faq-item">
                <h3>Що таке OneDay?</h3>
                <p>OneDay — це додаток, який використовує штучний інтелект для створення персоналізованих планів на день. Ви просто кажете, чого хочете, а наш ШІ розробляє для вас детальний розклад.</p>
              </div>
              
              <div className="faq-item">
                <h3>Як це працює?</h3>
                <p>Дуже просто! Ви пишете свій запит (наприклад, "Хочу провести день з друзями в парку") та обираєте свої інтереси (їжа, спорт, мистецтво тощо). На основі цих даних наш ШІ складає для вас готовий план.</p>
              </div>
              
              <div className="faq-item">
                <h3>Які запити я можу робити?</h3>
                <p>Будь-які! Ви можете бути конкретним або загальним. Ось кілька прикладів:</p>
                <ul>
                  <li>"Хочу романтичний вечір у Львові"</li>
                  <li>"Чим зайнятися з дітьми в Одесі в дощовий день?"</li>
                  <li>"Я в своєму місті і хочу просто розслабитися"</li>
                  <li>"Продуктивний день: спорт і навчання"</li>
                </ul>
                <p>Чим точніше ви опишете свій настрій та побажання, тим кращим буде результат.</p>
              </div>
              
              <div className="faq-item">
                <h3>Навіщо обирати "інтереси"?</h3>
                <p>Ваші інтереси допомагають ШІ краще вас зрозуміти. Якщо ви вкажете, що любите "історію", план "відпочинку у Вінниці" може включати відвідування музею. Якщо оберете "їжа" — запропонує цікаві кафе. Це робить ваш план справді персоналізованим.</p>
              </div>
              
              <div className="faq-item">
                <h3>Це безкоштовно?</h3>
                <p>Так, ви можете користуватися основними функціями OneDay абсолютно безкоштовно.</p>
              </div>
              
              <div className="faq-item">
                <h3>Чи працює OneDay в моєму місті?</h3>
                <p>Так! Наш ШІ спирається на загальнодоступну інформацію і може генерувати ідеї для будь-якого міста чи локації, яку ви вкажете у своєму запиті.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="contact-modal-overlay" onClick={closeContactModal}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="contact-modal-header">
              <h2>Зв'язатися з нами</h2>
              <button className="close-btn" onClick={closeContactModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="contact-modal-content">
              <div className="contact-intro">
                <i className="fas fa-headset"></i>
                <p>Маєте запитання чи пропозиції? Ми завжди раді допомогти!</p>
              </div>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-method-icon">
                    <i className="fab fa-telegram"></i>
                  </div>
                  <div className="contact-method-content">
                    <h3>Telegram</h3>
                    <p>Напишіть нам в Telegram</p>
                    <a href="https://t.me/unverfy" target="_blank" rel="noopener noreferrer" className="contact-link">
                      <i className="fab fa-telegram"></i>
                      @unverfy
                    </a>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="contact-method-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-method-content">
                    <h3>Email</h3>
                    <p>Надішліть нам листа</p>
                    <a href="mailto:artemsidorthuk228@gmail.com" className="contact-link">
                      <i className="fas fa-envelope"></i>
                      artemsidorthuk228@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-support">
                <h4>Швидка допомога</h4>
                <p>Ми відповідаємо на всі звернення протягом 24 годин.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {historyModalOpen && (
        <div className="history-modal-overlay" onClick={closeHistoryModal}>
          <div className="history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="history-modal-header">
              <h2>Історія планів</h2>
              <button className="close-btn" onClick={closeHistoryModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="history-modal-content">
              {/* Search and Filters */}
              <div className="history-controls">
                <div className="search-container">
                  <i className="fas fa-search"></i>
                  <input 
                    type="text" 
                    placeholder="Пошук по назві, місту або місцю..." 
                    className="search-input"
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                  />
                </div>
                <div className="history-tabs">
                  <button 
                    className={`tab-btn ${historyTab === 'all' ? 'active' : ''}`}
                    onClick={() => setHistoryTab('all')}
                  >
                    Вся історія
                  </button>
                  <button 
                    className={`tab-btn ${historyTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setHistoryTab('favorites')}
                  >
                    Збережені
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              {(() => {
                const normalizedSearch = historySearch.toLowerCase().trim();
                const filtered = planHistory
                  .filter(item => historyTab === 'all' || item.isFavorite)
                  .filter(item => {
                    if (!normalizedSearch) return true;
                    const inTitle = item.plan.title.toLowerCase().includes(normalizedSearch);
                    const inSubtitle = item.plan.subtitle?.toLowerCase().includes(normalizedSearch);
                    const inPrompt = item.prompt.toLowerCase().includes(normalizedSearch);
                    const inActivities = item.plan.activities.some(a =>
                      a.location.toLowerCase().includes(normalizedSearch) ||
                      a.title.toLowerCase().includes(normalizedSearch)
                    );
                    return inTitle || inSubtitle || inPrompt || inActivities;
                  });

                if (filtered.length === 0) {
                  return (
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <i className="fas fa-calendar-plus"></i>
                      </div>
                      <h3>Поки що немає збережених планів</h3>
                      <p>Створіть свій перший ідеальний день, і він з'явиться тут в історії.</p>
                      <button className="create-plan-btn" onClick={closeHistoryModal}>
                        <i className="fas fa-plus"></i>
                        Створити план
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="plans-grid">
                    {filtered.map(item => {
                      const createdDate = new Date(item.createdAt);
                      const dateText = createdDate.toLocaleDateString('uk-UA', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      });

                      const firstActivity = item.plan.activities[0];

                      const handleOpenDetails = () => {
                        setGeneratedPlan(item.plan);
                        closeHistoryModal();
                      };

                      const handleToggleFavorite = (e: React.MouseEvent) => {
                        e.stopPropagation();
                        togglePlanFavoriteInHistory(item.id);
                      };

                      const handleDelete = (e: React.MouseEvent) => {
                        e.stopPropagation();
                        deletePlanFromHistory(item.id);
                      };

                      return (
                        <div 
                          key={item.id} 
                          className="plan-card"
                          onClick={handleOpenDetails}
                        >
                          <div className="plan-card-header">
                            <h3>{item.plan.title}</h3>
                            <div className="plan-date">{dateText}</div>
                          </div>
                          <div className="plan-card-body">
                            {firstActivity && (
                              <div className="plan-location">
                                <i className="fas fa-map-marker-alt"></i>
                                {firstActivity.location}
                              </div>
                            )}
                            <div className="plan-description">
                              {item.plan.subtitle || item.prompt}
                            </div>
                          </div>
                          <div className="plan-card-actions">
                            <button 
                              className="action-btn detail-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetails();
                              }}
                            >
                              <i className="fas fa-eye"></i>
                              Детальніше
                            </button>
                            <button 
                              className={`action-btn favorite-btn ${item.isFavorite ? 'active' : ''}`}
                              onClick={handleToggleFavorite}
                              title={item.isFavorite ? 'Видалити з обраних' : 'Додати в обрані'}
                            >
                              <i className="fas fa-star"></i>
                            </button>
                            <button 
                              className="action-btn delete-btn"
                              onClick={handleDelete}
                              title="Видалити з історії"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Interests Modal */}
      {interestsModalOpen && (
        <div className="interests-modal-overlay" onClick={closeInterestsModal}>
          <div className="interests-modal" onClick={(e) => e.stopPropagation()}>
            <div className="interests-modal-header">
              <h2>Мої інтереси</h2>
              <button className="close-btn" onClick={closeInterestsModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="interests-modal-content">
              {/* Personalization Progress */}
              <div className="personalization-progress">
                <h3>Рівень вашої персоналізації</h3>
                <div className="progress-bar">
                  {(() => {
                    const hasInterests = selectedInterests.length > 0;
                    const hasBudget = selectedBudget !== '';
                    const hasCompany = selectedCompany !== '';
                    const progress = ((hasInterests ? 40 : 0) + (hasBudget ? 30 : 0) + (hasCompany ? 30 : 0));
                    return (
                      <>
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                        <p className="progress-text">
                          {progress}% завершено - {progress < 100 ? 'Додайте ваші інтереси для кращої персоналізації планів!' : 'Відмінно! Ваш профіль повністю налаштований.'}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Interests Section */}
              <div className="interests-section">
                <h3>Ваші інтереси</h3>
                <p>Оберіть те, що вас цікавить:</p>
                <div className="interests-grid">
                  {['☕ Кава', '🌳 Парки', '🎨 Мистецтво', '🍽️ Ресторани', '🎬 Кіно', '🏃 Спорт', '📚 Книги', '🎵 Музика', '🛍️ Шопінг', '🌊 Природа'].map((interest) => (
                    <label key={interest} className="interest-tag">
                      <input 
                        type="checkbox" 
                        checked={selectedInterests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Section */}
              <div className="budget-section">
                <h3>Ваш бюджет</h3>
                <p>Оберіть комфортний для вас рівень витрат:</p>
                <div className="budget-options">
                  <label className="budget-option">
                    <input 
                      type="radio" 
                      name="budget" 
                      value="low" 
                      checked={selectedBudget === 'low'}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                    />
                    <span className="budget-label">
                      <span className="budget-symbol">$</span>
                      <span className="budget-text">Економний</span>
                    </span>
                  </label>
                  <label className="budget-option">
                    <input 
                      type="radio" 
                      name="budget" 
                      value="medium" 
                      checked={selectedBudget === 'medium'}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                    />
                    <span className="budget-label">
                      <span className="budget-symbol">$$</span>
                      <span className="budget-text">Середній</span>
                    </span>
                  </label>
                  <label className="budget-option">
                    <input 
                      type="radio" 
                      name="budget" 
                      value="high" 
                      checked={selectedBudget === 'high'}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                    />
                    <span className="budget-label">
                      <span className="budget-symbol">$$$</span>
                      <span className="budget-text">Преміум</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Company Section */}
              <div className="company-section">
                <h3>Компанія</h3>
                <p>З ким ви зазвичай проводите час:</p>
                <div className="company-options">
                  <label className="company-option">
                    <input 
                      type="radio" 
                      name="company" 
                      value="alone" 
                      checked={selectedCompany === 'alone'}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                    />
                    <span className="company-label">
                      <i className="fas fa-user"></i>
                      <span>Сам</span>
                    </span>
                  </label>
                  <label className="company-option">
                    <input 
                      type="radio" 
                      name="company" 
                      value="couple" 
                      checked={selectedCompany === 'couple'}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                    />
                    <span className="company-label">
                      <i className="fas fa-heart"></i>
                      <span>З парою</span>
                    </span>
                  </label>
                  <label className="company-option">
                    <input 
                      type="radio" 
                      name="company" 
                      value="friends" 
                      checked={selectedCompany === 'friends'}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                    />
                    <span className="company-label">
                      <i className="fas fa-users"></i>
                      <span>З друзями</span>
                    </span>
                  </label>
                  <label className="company-option">
                    <input 
                      type="radio" 
                      name="company" 
                      value="family" 
                      checked={selectedCompany === 'family'}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                    />
                    <span className="company-label">
                      <i className="fas fa-home"></i>
                      <span>З сім'єю</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="interests-actions">
                <button type="button" className="cancel-btn" onClick={closeInterestsModal}>
                  Скасувати
                </button>
                <button type="button" className="save-btn" onClick={handleSaveInterests}>
                  Зберегти інтереси
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editProfileModalOpen && (
        <div className="edit-profile-modal-overlay" onClick={closeEditProfileModal}>
          <div className="edit-profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-profile-modal-header">
              <h2>Редагування профілю</h2>
              <button className="close-btn" onClick={closeEditProfileModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="edit-profile-modal-content">
              <form className="edit-profile-form">
                <div className="profile-photo-section">
                  <div className="current-photo">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div className="photo-actions">
                    <label htmlFor="photo-upload" className="photo-upload-btn">
                      <i className="fas fa-camera"></i>
                      Змінити фото
                    </label>
                    <input type="file" id="photo-upload" accept="image/*" style={{ display: 'none' }} />
                    <button type="button" className="remove-photo-btn">
                      <i className="fas fa-trash"></i>
                      Видалити фото
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-login">Логін</label>
                  <input type="text" id="edit-login" defaultValue={user?.login} readOnly className="readonly-field" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="edit-email">Email</label>
                  <input type="email" id="edit-email" defaultValue={user?.email} readOnly className="readonly-field" />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={closeEditProfileModal}>
                    Скасувати
                  </button>
                  <button type="submit" className="save-btn">
                    Зберегти зміни
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Modal */}
      {favoritesModalOpen && (
        <div className="favorites-modal-overlay" onClick={closeFavoritesModal}>
          <div className="favorites-modal" onClick={(e) => e.stopPropagation()}>
            <div className="favorites-modal-header">
              <h2>Улюблені місця</h2>
              <button className="close-btn" onClick={closeFavoritesModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="favorites-modal-content">
              <FavoritesSection />
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changePasswordModalOpen && (
        <div className="change-password-modal-overlay" onClick={closeChangePasswordModal}>
          <div className="change-password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="change-password-modal-header">
              <h2>Зміна пароля</h2>
              <button className="close-btn" onClick={closeChangePasswordModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="change-password-modal-content">
              <form className="change-password-form">
                <div className="form-group">
                  <label htmlFor="current-password">Поточний пароль</label>
                  <input type="password" id="current-password" placeholder="Введіть поточний пароль" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="new-password">Новий пароль</label>
                  <input type="password" id="new-password" placeholder="Введіть новий пароль" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirm-password">Підтвердіть новий пароль</label>
                  <input type="password" id="confirm-password" placeholder="Підтвердіть новий пароль" />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={closeChangePasswordModal}>
                    Скасувати
                  </button>
                  <button type="submit" className="save-btn">
                    Зберегти пароль
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
