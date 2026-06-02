import { GEMINI_API_KEY } from '../constants';
import { DayPlan, GeminiResponse } from '../types';

export class GeminiService {
  private static instance: GeminiService;
  private apiKey: string;

  private constructor() {
    this.apiKey = GEMINI_API_KEY;
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  public async generatePlan(userInput: string, userInterests?: string[], userBudget?: string, userCompany?: string): Promise<DayPlan | null> {
    try {
      console.log('🤖 Attempting to generate plan with Gemini AI...');
      console.log('📝 User input:', userInput);
      
      // Check if API key is valid
      if (this.apiKey === 'YOUR_GEMINI_API_KEY_HERE' || !this.apiKey) {
        console.log('❌ API key not configured');
        return null;
      }
      
      console.log('🔑 API key found:', this.apiKey.substring(0, 10) + '...');
      
      // Формуємо інформацію про інтереси користувача
      let interestsInfo = '';
      if (userInterests && userInterests.length > 0) {
        interestsInfo = `\n\nІНТЕРЕСИ КОРИСТУВАЧА (обов'язково врахуй їх при плануванні):\n${userInterests.join(', ')}\n`;
      }
      
      let budgetInfo = '';
      if (userBudget) {
        const budgetText = userBudget === 'low' ? 'Економний' : userBudget === 'medium' ? 'Середній' : 'Преміум';
        budgetInfo = `\nБЮДЖЕТ: ${budgetText} - підбирай місця відповідно до бюджету користувача.\n`;
      }
      
      let companyInfo = '';
      if (userCompany) {
        const companyText = userCompany === 'alone' ? 'Сам' : 
                           userCompany === 'couple' ? 'З парою' : 
                           userCompany === 'friends' ? 'З друзями' : 
                           userCompany === 'family' ? 'З сім\'єю' : userCompany;
        companyInfo = `\nКОМПАНІЯ: ${companyText} - врахуй це при плануванні активностей.\n`;
      }
      
      const prompt = `Ти - експерт з планування ідеальних днів в Україні. Користувач описав свої побажання: "${userInput}"${interestsInfo}${budgetInfo}${companyInfo}

Створи детальний план дня з КОНКРЕТНИМИ місцями та активностями, які ВІДПОВІДАЮТЬ інтересам користувача. Відповідай ТІЛЬКИ у форматі JSON без додаткового тексту:

{
  "title": "Назва плану",
  "subtitle": "Короткий опис",
  "activities": [
    {
      "time": "09:00",
      "title": "Назва активності",
      "description": "Детальний опис",
      "location": "КОНКРЕТНА назва закладу, парку, музею, ресторану з адресою"
    }
  ]
}

КРИТИЧНО ВАЖЛИВО - ПЕРЕВІРКА РЕАЛЬНОСТІ МІСЬ:
- ОБОВ'ЯЗКОВО використовуй Google Search для пошуку реальних закладів, їх назв та точних адрес!
- Використовуй ТІЛЬКИ реальні, існуючі місця в Україні. АБСОЛЮТНО ЗАБОРОНЕНО вигадувати назви чи адреси.
- Кожне місце має мати ПОВНУ назву закладу/парку/музею та ПРАВИЛЬНУ адресу.
- Перевіряй, що заклади дійсно існують у вказаному місті за допомогою пошуку.
- Якщо Google Search не знаходить конкретний заклад за цією адресою - НЕ використовуй його, знайди інший реальний заклад.
- Якщо не впевнений у назві або адресі - краще вказати загальну відому локацію (наприклад "Центральний парк", "Майдан Незалежності").
- Адреси мають бути точними (наприклад "вул. Соборна, 45, Вінниця").

ІНШІ ВИМОГИ:
- Якщо користувач вказав місто (наприклад "Вінниця"), використовуй місця ТІЛЬКИ з цього міста
- Створюй реалістичний розклад з 6-8 активностями з 09:00 до 20:00
- ОБОВ'ЯЗКОВО враховуй інтереси користувача при виборі активностей та місць
- Якщо користувач любить каву - додай реальні кав'ярні, якщо мистецтво - реальні музеї та галереї, якщо спорт - реальні спортивні активності тощо
- Будь креативним та персоналізованим, але завжди використовуй ТІЛЬКИ реальні місця`;

      console.log('📤 Sending request to Gemini API...');
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            tools: [{
              googleSearch: {}
            }]
          })
        }
      );

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        return null;
      }

      const data: GeminiResponse = await response.json();
      console.log('📥 Raw response:', data);

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('❌ Invalid response structure:', data);
        return null;
      }

      const text = data.candidates[0].content.parts[0].text;
      console.log('📥 Received text from Gemini:', text);

      // Try to parse JSON response
      let cleanText = text.replace(/```json|```/g, '').trim();

      // Find JSON in the response
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }

      console.log('🧹 Cleaned text for parsing:', cleanText);

      const planData: DayPlan = JSON.parse(cleanText);
      console.log('✅ Successfully parsed AI plan:', planData);

      // Validate the plan
      if (!planData.title || !planData.activities || planData.activities.length === 0) {
        console.error('❌ Invalid plan structure:', planData);
        return null;
      }

      return planData;

    } catch (error) {
      console.error('❌ Gemini API error:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      } else {
        console.error('Error details:', String(error));
      }
      return null;
    }
  }


  public async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
        {
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
        }
      );

      return response.ok;
    } catch (error) {
      console.error('❌ Gemini connection test failed:', error);
      return false;
    }
  }
}
