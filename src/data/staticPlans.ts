import { Activity } from '../types';

export interface StaticPlan {
  [theme: string]: {
    [location: string]: {
      [dayType: string]: Activity[];
    };
  };
}

export const dayPlans: StaticPlan = {
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
