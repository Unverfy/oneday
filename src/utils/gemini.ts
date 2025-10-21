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

  public async generatePlan(userInput: string): Promise<DayPlan | null> {
    try {
      console.log('🤖 Attempting to generate plan with Gemini AI...');
      console.log('📝 User input:', userInput);
      
      // Check if API key is valid
      if (this.apiKey === 'YOUR_GEMINI_API_KEY_HERE' || !this.apiKey) {
        console.log('❌ API key not configured');
        return null;
      }
      
      console.log('🔑 API key found:', this.apiKey.substring(0, 10) + '...');
      
      const prompt = `Ти - експерт з планування ідеальних днів в Україні. Користувач описав свої побажання: "${userInput}"

Створи детальний план дня з КОНКРЕТНИМИ місцями та активностями. Відповідай ТІЛЬКИ у форматі JSON без додаткового тексту:

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

ВАЖЛИВО:
- Використовуй ТІЛЬКИ реальні місця в Україні
- Вказуй конкретні назви закладів, парків, музеїв
- Додавай адреси або район міста
- Якщо користувач вказав місто (наприклад "Вінниця"), використовуй місця з цього міста
- Створюй реалістичний розклад з 6-8 активностями з 09:00 до 20:00
- Будь креативним та персоналізованим`;

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
