// OneDay - Генератор ідеального дня
console.log('OneDay - Генератор ідеального дня ✨');

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyBlgKaDg6-ZRS1WLJ8AWaz5RoEXDw650Fo';
let genAI = null;

// Initialize Gemini AI
function initGeminiAI() {
  // Wait for the library to load
  setTimeout(() => {
    if (typeof google !== 'undefined' && google.generativeai) {
      genAI = google.generativeai;
      console.log('✅ Gemini AI initialized successfully');
    } else {
      console.warn('⚠️ Gemini AI library not loaded, trying alternative method...');
      // Try alternative initialization
      tryAlternativeGeminiInit();
    }
  }, 1000);
}

// Alternative Gemini initialization using fetch
async function tryAlternativeGeminiInit() {
  try {
    console.log('🔄 Trying alternative Gemini initialization...');
    
    // Test API key with a simple request
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Hello"
          }]
        }]
      })
    });
    
    if (response.ok) {
      console.log('✅ Alternative Gemini API connection successful');
      genAI = { alternative: true }; // Mark as alternative method
    } else {
      console.error('❌ Alternative Gemini API failed:', response.status);
      genAI = null;
    }
  } catch (error) {
    console.error('❌ Alternative Gemini initialization failed:', error);
    genAI = null;
  }
}

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const sidebar = document.getElementById('sidebar');
const settingsBtn = document.getElementById('settingsBtn');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('overlay');
const userInput = document.getElementById('userInput');
const generateBtn = document.getElementById('generateBtn');
const optionTags = document.getElementById('optionTags');
const planContainer = document.getElementById('planContainer');

// Theme dropdown elements
const themeDropdownBtn = document.getElementById('themeDropdownBtn');
const themeDropdown = document.getElementById('themeDropdown');
const selectedThemeText = document.getElementById('selectedThemeText');

// Day type dropdown elements
const dayTypeDropdownBtn = document.getElementById('dayTypeDropdownBtn');
const dayTypeDropdown = document.getElementById('dayTypeDropdown');
const selectedDayTypeText = document.getElementById('selectedDayTypeText');

// Loading state elements
const generateIcon = document.getElementById('generateIcon');
const generateText = document.getElementById('generateText');
const loadingSpinner = document.getElementById('loadingSpinner');

// State
let currentTheme = 'light';
let selectedOptions = {
  theme: null,
  dayType: null
};

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('oneday-theme') || 'light';
  setTheme(savedTheme);
}

function setTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  localStorage.setItem('oneday-theme', theme);
}

function toggleTheme() {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Loading State Management
function setLoadingState(isLoading) {
  const generateBtn = document.getElementById('generateBtn');
  
  if (isLoading) {
    generateBtn.disabled = true;
    generateIcon.style.display = 'none';
    generateText.style.display = 'none';
    loadingSpinner.style.display = 'flex';
    generateText.textContent = 'Генеруємо план...';
  } else {
    generateBtn.disabled = false;
    generateIcon.style.display = 'inline';
    generateText.style.display = 'inline';
    loadingSpinner.style.display = 'none';
    generateText.textContent = 'Створити ідеальний день';
  }
}

// Sidebar Management
function openSidebar() {
  sidebar.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebarMenu() {
  sidebar.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Theme Dropdown Management
function toggleThemeDropdown() {
  const isOpen = themeDropdown.classList.contains('open');
  
  if (isOpen) {
    closeThemeDropdown();
  } else {
    openThemeDropdown();
  }
}

function openThemeDropdown() {
  themeDropdown.classList.add('open');
  themeDropdownBtn.classList.add('open');
}

function closeThemeDropdown() {
  themeDropdown.classList.remove('open');
  themeDropdownBtn.classList.remove('open');
}

function selectTheme(theme, button) {
  selectedOptions.theme = theme;
  
  // Update dropdown button text
  const themeLabels = {
    relax: '🌅 Розслаблення',
    productive: '⚡ Продуктивність',
    romantic: '💕 Романтика',
    adventure: '🗺️ Пригоди',
    detox: '📱 Цифровий детокс',
    cultural: '🎭 Культура'
  };
  
  selectedThemeText.textContent = themeLabels[theme];
  
  // Close dropdown
  closeThemeDropdown();
  
  // Update option tags
  updateOptionTags();
}

// Day Type Dropdown Management
function toggleDayTypeDropdown() {
  const isOpen = dayTypeDropdown.classList.contains('open');
  
  if (isOpen) {
    closeDayTypeDropdown();
  } else {
    openDayTypeDropdown();
  }
}

function openDayTypeDropdown() {
  dayTypeDropdown.classList.add('open');
  dayTypeDropdownBtn.classList.add('open');
}

function closeDayTypeDropdown() {
  dayTypeDropdown.classList.remove('open');
  dayTypeDropdownBtn.classList.remove('open');
}

function selectDayType(dayType, button) {
  selectedOptions.dayType = dayType;
  
  // Update dropdown button text
  const dayTypeLabels = {
    weekend: '🎉 Вихідний',
    workday: '💼 Робочий',
    vacation: '✈️ Відпустка'
  };
  
  selectedDayTypeText.textContent = dayTypeLabels[dayType];
  
  // Close dropdown
  closeDayTypeDropdown();
  
  // Update option tags
  updateOptionTags();
}

// Option Selection
function selectOption(type, value, button) {
  // Remove active class from all buttons of the same type
  const buttons = document.querySelectorAll(`.${type}-btn`);
  buttons.forEach(btn => btn.classList.remove('active'));
  
  // Add active class to clicked button
  button.classList.add('active');
  
  // Update selected options
  selectedOptions[type] = value;
  
  // Update option tags display
  updateOptionTags();
}

function updateOptionTags() {
  optionTags.innerHTML = '';
  
  Object.entries(selectedOptions).forEach(([type, value]) => {
    if (value) {
      const tag = createOptionTag(type, value);
      optionTags.appendChild(tag);
    }
  });
}

function createOptionTag(type, value) {
  const tag = document.createElement('div');
  tag.className = 'option-tag';
  
  const typeLabels = {
    theme: 'Тема',
    dayType: 'Тип дня'
  };
  
  const valueLabels = {
    theme: {
      relax: '🌅 Розслаблення',
      productive: '⚡ Продуктивність',
      romantic: '💕 Романтика',
      adventure: '🗺️ Пригоди',
      detox: '📱 Цифровий детокс',
      cultural: '🎭 Культура'
    },
    dayType: {
      weekend: '🎉 Вихідний',
      workday: '💼 Робочий',
      vacation: '✈️ Відпустка'
    }
  };
  
  tag.innerHTML = `
    <span>${typeLabels[type]}: ${valueLabels[type][value]}</span>
    <span class="remove" onclick="removeOption('${type}')">×</span>
  `;
  
  return tag;
}

function removeOption(type) {
  selectedOptions[type] = null;
  
  // Remove active class from corresponding button
  const button = document.querySelector(`.${type}-btn.active`);
  if (button) {
    button.classList.remove('active');
  }
  
  updateOptionTags();
}

// Day Plan Generation
const dayPlans = {
  relax: {
    kyiv: {
      weekend: [
        { time: '09:00', title: 'Сніданок у кав\'ярні', description: 'Починаємо день з ароматної кави та свіжих круасанів', location: 'Кав\'ярня "Львівська майстерня шоколаду"' },
        { time: '10:30', title: 'Прогулянка по парку', description: 'Розслабляюча прогулянка по Мариїнському парку', location: 'Мариїнський парк' },
        { time: '12:00', title: 'СПА процедури', description: 'Відновлювальний масаж та релакс', location: 'СПА "Метрополітен"' },
        { time: '14:00', title: 'Обід', description: 'Легкий обід зі здорової їжі', location: 'Ресторан "Оранж"' },
        { time: '16:00', title: 'Читання в бібліотеці', description: 'Тихий час з улюбленою книгою', location: 'Національна бібліотека' },
        { time: '18:00', title: 'Вечеря', description: 'Романтична вечеря з видом на місто', location: 'Ресторан "Місто"' }
      ],
      workday: [
        { time: '07:00', title: 'Ранкова медитація', description: '10 хвилин медитації для гарного настрою', location: 'Дома' },
        { time: '08:00', title: 'Сніданок', description: 'Здоровий сніданок з фруктами', location: 'Дома' },
        { time: '12:00', title: 'Обідня прогулянка', description: 'Коротка прогулянка під час обідньої перерви', location: 'Поруч з офісом' },
        { time: '18:00', title: 'Йога', description: 'Розслабляючий клас йоги', location: 'Йога-студія "Ом"' },
        { time: '19:30', title: 'Вечеря', description: 'Легка вечеря з друзями', location: 'Кафе "Друзі"' }
      ]
    },
    lviv: {
      weekend: [
        { time: '09:00', title: 'Сніданок у кав\'ярні', description: 'Традиційний львівський сніданок', location: 'Кав\'ярня "Криївка"' },
        { time: '10:30', title: 'Прогулянка по Старому місту', description: 'Оглядання архітектурних пам\'яток', location: 'Площа Ринок' },
        { time: '12:00', title: 'Відвідування музею', description: 'Екскурсія по Львівській галереї мистецтв', location: 'Львівська галерея мистецтв' },
        { time: '14:00', title: 'Обід', description: 'Традиційна українська кухня', location: 'Ресторан "Криївка"' },
        { time: '16:00', title: 'Кава на даху', description: 'Кава з панорамним видом на місто', location: 'Кав\'ярня "Дім легенд"' },
        { time: '18:00', title: 'Вечеря', description: 'Романтична вечеря в історичному ресторані', location: 'Ресторан "Мазох кафе"' }
      ]
    }
  },
  productive: {
    kyiv: {
      weekend: [
        { time: '07:00', title: 'Ранкова пробіжка', description: 'Енергійна пробіжка по набережній', location: 'Набережна Дніпра' },
        { time: '08:30', title: 'Сніданок', description: 'Поживний сніданок з білками', location: 'Кафе "Здоров\'я"' },
        { time: '10:00', title: 'Робота над проектом', description: 'Фокусована робота над особистим проектом', location: 'Коворкінг "Часопис"' },
        { time: '12:00', title: 'Спортзал', description: 'Силова тренування', location: 'Фітнес-клуб "Атлант"' },
        { time: '14:00', title: 'Обід', description: 'Білковий обід для відновлення', location: 'Ресторан "Фітнес-кухня"' },
        { time: '15:30', title: 'Навчання', description: 'Вивчення нової навички онлайн', location: 'Дома' },
        { time: '17:00', title: 'Планування', description: 'Планування наступного тижня', location: 'Дома' },
        { time: '18:30', title: 'Вечеря', description: 'Легка вечеря з друзями', location: 'Ресторан "Спорт"' }
      ]
    }
  },
  romantic: {
    kyiv: {
      weekend: [
        { time: '10:00', title: 'Пікнік у парку', description: 'Романтичний пікнік з коханою людиною', location: 'Парк "Феофанія"' },
        { time: '12:00', title: 'Прогулянка на човні', description: 'Романтична прогулянка по Дніпру', location: 'Набережна Дніпра' },
        { time: '14:00', title: 'Обід', description: 'Романтичний обід з видом на воду', location: 'Ресторан "Остров"' },
        { time: '16:00', title: 'Кіно', description: 'Перегляд романтичного фільму', location: 'Кінотеатр "Планета кіно"' },
        { time: '18:00', title: 'Вечеря', description: 'Елегантна вечеря при свічках', location: 'Ресторан "Білий лебідь"' },
        { time: '20:00', title: 'Прогулянка', description: 'Вечірня прогулянка по центру міста', location: 'Хрещатик' }
      ]
    }
  }
};

async function generateDayPlan() {
  const userText = userInput.value.trim();
  
  console.log('🚀 Starting plan generation...');
  console.log('User input:', userText);
  console.log('Selected options:', selectedOptions);
  
  if (!userText) {
    showError('Будь ласка, опишіть свій день або виберіть опції з меню.');
    return;
  }
  
  // Set loading state
  setLoadingState(true);
  
  try {
    // Try Gemini API first
    console.log('🤖 Checking Gemini AI availability...');
    if (genAI) {
      console.log('✅ Gemini AI available, attempting generation...');
      const aiPlan = await generatePlanWithGemini(userText);
      if (aiPlan) {
        console.log('🎉 AI plan generated successfully!');
        displayAIPlan(aiPlan);
        return;
      } else {
        console.log('⚠️ AI generation failed, falling back to static plans');
      }
    } else {
      console.log('⚠️ Gemini AI not available, using static plans');
    }
    
    // Fallback to static plans
    console.log('📋 Using static plans...');
    const keywords = parseUserInput(userText);
    console.log('Parsed keywords:', keywords);
    
    const theme = selectedOptions.theme || keywords.theme || 'relax';
    const dayType = selectedOptions.dayType || keywords.dayType || 'weekend';
    const location = 'kyiv';
    
    console.log('Using theme:', theme, 'dayType:', dayType, 'location:', location);
    
    const plan = dayPlans[theme]?.[location]?.[dayType];
    
    if (!plan) {
      console.log('❌ No static plan found for these parameters');
      showError('На жаль, для цих параметрів ще немає готового плану. Спробуйте інші опції.');
      return;
    }
    
    console.log('✅ Static plan found, displaying...');
    displayDayPlan(plan, theme, location, dayType);
    
  } catch (error) {
    console.error('❌ Error generating plan:', error);
    showError('Виникла помилка при генерації плану. Спробуйте ще раз.');
  } finally {
    setLoadingState(false);
  }
}

async function generatePlanWithGemini(userInput) {
  try {
    console.log('🤖 Attempting to generate plan with Gemini AI...');
    
    if (!genAI) {
      console.log('❌ Gemini AI not initialized');
      return null;
    }
    
    // Use alternative method if library not loaded
    if (genAI.alternative) {
      return await generatePlanWithFetch(userInput);
    }
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro", 
      apiKey: GEMINI_API_KEY 
    });
    
    const prompt = `Ти - експерт з планування ідеальних днів в Україні. Користувач описав свої побажання: "${userInput}"

Створи детальний план дня з конкретними місцями та активностями. Відповідай ТІЛЬКИ у форматі JSON без додаткового тексту:

{
  "title": "Назва плану",
  "subtitle": "Короткий опис",
  "activities": [
    {
      "time": "09:00",
      "title": "Назва активності",
      "description": "Детальний опис",
      "location": "Конкретна адреса або назва місця"
    }
  ]
}

Врахуй:
- Місцезнаходження користувача (якщо вказано)
- Тип дня (вихідний/робочий/відпустка)
- Тему дня (розслаблення/продуктивність/романтика/пригоди/культура)
- Реалістичний розклад з часом
- Конкретні місця в Україні (якщо не вказано інше)
- Різноманітні активності протягом дня
- 6-8 активностей з 09:00 до 20:00`;

    console.log('📤 Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📥 Received response from Gemini:', text.substring(0, 200) + '...');
    
    // Try to parse JSON response
    let cleanText = text.replace(/```json|```/g, '').trim();
    
    // Find JSON in the response
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }
    
    const planData = JSON.parse(cleanText);
    console.log('✅ Successfully parsed AI plan:', planData.title);
    
    return planData;
    
  } catch (error) {
    console.error('❌ Gemini API error:', error);
    console.error('Error details:', error.message);
    return null;
  }
}

// Alternative method using direct fetch
async function generatePlanWithFetch(userInput) {
  try {
    console.log('🔄 Using fetch method for Gemini API...');
    
    const prompt = `Ти - експерт з планування ідеальних днів в Україні. Користувач описав свої побажання: "${userInput}"

Створи детальний план дня з конкретними місцями та активностями. Відповідай ТІЛЬКИ у форматі JSON без додаткового тексту:

{
  "title": "Назва плану",
  "subtitle": "Короткий опис",
  "activities": [
    {
      "time": "09:00",
      "title": "Назва активності",
      "description": "Детальний опис",
      "location": "Конкретна адреса або назва місця"
    }
  ]
}

Врахуй:
- Місцезнаходження користувача (якщо вказано)
- Тип дня (вихідний/робочий/відпустка)
- Тему дня (розслаблення/продуктивність/романтика/пригоди/культура)
- Реалістичний розклад з часом
- Конкретні місця в Україні (якщо не вказано інше)
- Різноманітні активності протягом дня
- 6-8 активностей з 09:00 до 20:00`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    console.log('📥 Received response from Gemini (fetch):', text.substring(0, 200) + '...');
    
    // Try to parse JSON response
    let cleanText = text.replace(/```json|```/g, '').trim();
    
    // Find JSON in the response
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }
    
    const planData = JSON.parse(cleanText);
    console.log('✅ Successfully parsed AI plan (fetch):', planData.title);
    
    return planData;
    
  } catch (error) {
    console.error('❌ Fetch Gemini API error:', error);
    return null;
  }
}

function parseUserInput(text) {
  const keywords = {
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

function displayDayPlan(plan, theme, location, dayType) {
  const themeLabels = {
    relax: '🌅 День розслаблення',
    productive: '⚡ Продуктивний день',
    romantic: '💕 Романтичний день',
    adventure: '🗺️ День пригод',
    detox: '📱 Цифровий детокс',
    cultural: '🎭 Культурний день'
  };
  
  const locationLabels = {
    kyiv: 'Київ',
    lviv: 'Львів',
    odesa: 'Одеса',
    home: 'Дома'
  };
  
  const dayTypeLabels = {
    weekend: 'Вихідний',
    workday: 'Робочий день',
    vacation: 'Відпустка'
  };
  
  const planHTML = `
    <div class="day-plan">
      <div class="plan-header">
        <h2 class="plan-title">${themeLabels[theme]}</h2>
        <p class="plan-subtitle">${locationLabels[location]} • ${dayTypeLabels[dayType]}</p>
      </div>
      <div class="activities-list">
        ${plan.map(activity => `
          <div class="activity-item">
            <div class="activity-time">${activity.time}</div>
            <div class="activity-title">${activity.title}</div>
            <div class="activity-description">${activity.description}</div>
            <div class="activity-location">
              <i class="fas fa-map-marker-alt"></i>
              ${activity.location}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  planContainer.innerHTML = planHTML;
}

function displayAIPlan(aiPlan) {
  const planHTML = `
    <div class="day-plan">
      <div class="plan-header">
        <h2 class="plan-title">${aiPlan.title}</h2>
        <p class="plan-subtitle">${aiPlan.subtitle}</p>
        <div class="ai-badge">
          <i class="fas fa-robot"></i>
          Згенеровано за допомогою AI
        </div>
      </div>
      <div class="activities-list">
        ${aiPlan.activities.map(activity => `
          <div class="activity-item">
            <div class="activity-time">${activity.time}</div>
            <div class="activity-title">${activity.title}</div>
            <div class="activity-description">${activity.description}</div>
            <div class="activity-location">
              <i class="fas fa-map-marker-alt"></i>
              ${activity.location}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  planContainer.innerHTML = planHTML;
}

function showError(message) {
  planContainer.innerHTML = `
    <div class="error-message">
      <i class="fas fa-exclamation-triangle"></i>
      <h2>Помилка</h2>
      <p>${message}</p>
    </div>
  `;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initTheme();
  
  // Initialize Gemini AI
  initGeminiAI();
  
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Settings sidebar controls
  settingsBtn.addEventListener('click', openSidebar);
  closeSidebar.addEventListener('click', closeSidebarMenu);
  overlay.addEventListener('click', closeSidebarMenu);
  
  // Theme dropdown
  themeDropdownBtn.addEventListener('click', toggleThemeDropdown);
  
  // Theme options
  document.querySelectorAll('.theme-option').forEach(btn => {
    btn.addEventListener('click', () => selectTheme(btn.dataset.theme, btn));
  });
  
  // Day type dropdown
  dayTypeDropdownBtn.addEventListener('click', toggleDayTypeDropdown);
  
  // Day type options
  document.querySelectorAll('.day-type-option').forEach(btn => {
    btn.addEventListener('click', () => selectDayType(btn.dataset.type, btn));
  });
  
  // Generate button
  generateBtn.addEventListener('click', generateDayPlan);
  
  // Enter key in textarea
  userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      generateDayPlan();
    }
  });
  
  // Close dropdowns and sidebar on escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeThemeDropdown();
      closeDayTypeDropdown();
      closeSidebarMenu();
    }
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!themeDropdownBtn.contains(e.target) && !themeDropdown.contains(e.target)) {
      closeThemeDropdown();
    }
    if (!dayTypeDropdownBtn.contains(e.target) && !dayTypeDropdown.contains(e.target)) {
      closeDayTypeDropdown();
    }
  });
});

// Make removeOption globally available
window.removeOption = removeOption;
