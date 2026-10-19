import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side GoogleGenAI initialization
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

/**
 * Text-to-Speech Endpoint
 * Uses the requested gemini-3.8-flash-tts model
 */
app.post('/api/tts', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      text,
      voice = 'Puck',
      coachStyle = 'Enthusiastic, encouraging fitness and nutrition coach',
      coachName = 'Coach',
    } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text prompt is required.' });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: 'Gemini API key is not configured on the server.',
        fallback: true,
      });
      return;
    }

    // Supported voices for TTS: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const validVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
    const chosenVoice = validVoices.includes(voice) ? voice : 'Puck';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${coachName}: ${text}`,
              speechMetadata: {
                speaker: coachName,
                style: coachStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: chosenVoice },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      res.status(500).json({ error: 'No audio data was returned by the TTS model.' });
      return;
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      voice: chosenVoice,
      text,
    });
  } catch (error: any) {
    console.error('Error generating TTS:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate speech with gemini-3.8-flash-tts',
      details: String(error),
    });
  }
});

/**
 * Nutritional & Fitness Insights Endpoint
 * Uses gemini-3.8-flash to assess daily food, workouts, and macro adherence
 */
app.post('/api/insights', async (req: Request, res: Response): Promise<void> => {
  try {
    const { goals, meals, workouts, waterMl, weightKg, streakDays } = req.body;

    if (!ai) {
      res.status(503).json({ error: 'Gemini API key is not configured.' });
      return;
    }

    const prompt = `You are an elite sports nutritionist and performance coach.
Analyze today's fitness and nutrition data for the user:

USER PROFILE & TARGETS:
- Goal Type: ${goals?.goalType || 'Maintenance / General Health'}
- Target Calories: ${goals?.targetCalories || 2200} kcal
- Target Macros: Protein ${goals?.targetProtein || 140}g, Carbs ${goals?.targetCarbs || 230}g, Fat ${goals?.targetFat || 65}g
- Target Water: ${goals?.targetWaterMl || 2500} ml
- Current Weight: ${weightKg || 74} kg, Target Weight: ${goals?.targetWeight || 72} kg
- Workout Streak: ${streakDays || 4} days

TODAY'S INTAKE & LOG:
- Water Drank: ${waterMl || 0} ml
- Meals Logged: ${JSON.stringify(meals || [])}
- Workouts Completed: ${JSON.stringify(workouts || [])}

Provide a deep, actionable, science-grounded assessment.
The 'spokenBriefing' field should be written in natural, spoken conversational coach persona (around 70 to 110 words), formatted with light natural breathing/vocal cues (e.g. <breath>, |yeah|) suitable for audio synthesis with gemini-3.8-flash-tts.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Punchy 1-sentence headline summarizing today’s progress.',
            },
            nutritionScore: {
              type: Type.INTEGER,
              description: 'Overall daily nutrition and goal adherence score from 0 to 100.',
            },
            macroAnalysis: {
              type: Type.STRING,
              description: 'Detailed analysis of protein intake timing, carbohydrate fuel, and fats balance.',
            },
            workoutSynergy: {
              type: Type.STRING,
              description: 'How the nutrition matched the workout intensity and recovery demands.',
            },
            hydrationVerdict: {
              type: Type.STRING,
              description: 'Evaluation of water and electrolyte status.',
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 practical, high-impact bullet recommendations.',
            },
            eveningMealSuggestion: {
              type: Type.STRING,
              description: 'Specific food or snack suggestion to hit any remaining macro deficit before bed.',
            },
            spokenBriefing: {
              type: Type.STRING,
              description: 'High-energy, encouraging 80-110 word coach briefing script ready for speech synthesis.',
            },
          },
          required: [
            'summary',
            'nutritionScore',
            'macroAnalysis',
            'workoutSynergy',
            'hydrationVerdict',
            'recommendations',
            'eveningMealSuggestion',
            'spokenBriefing',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error generating nutritional insights:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate insights',
    });
  }
});

/**
 * Natural Language Meal Estimator Endpoint
 * Parses natural food queries into exact macro items
 */
app.post('/api/estimate-meal', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Meal description query is required.' });
      return;
    }

    if (!ai) {
      res.status(503).json({ error: 'Gemini API key is not configured.' });
      return;
    }

    const prompt = `Estimate the realistic nutritional breakdown of this meal or food item:
"${query}"

Break it down into realistic individual components or a unified meal item. Provide realistic calories, protein, carbs, fat, fiber, and sodium.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mealName: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  portion: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  carbs: { type: Type.NUMBER },
                  fat: { type: Type.NUMBER },
                  fiber: { type: Type.NUMBER },
                },
                required: ['name', 'portion', 'calories', 'protein', 'carbs', 'fat'],
              },
            },
            totalCalories: { type: Type.NUMBER },
            totalProtein: { type: Type.NUMBER },
            totalCarbs: { type: Type.NUMBER },
            totalFat: { type: Type.NUMBER },
            quickTip: { type: Type.STRING },
          },
          required: [
            'mealName',
            'items',
            'totalCalories',
            'totalProtein',
            'totalCarbs',
            'totalFat',
            'quickTip',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error estimating meal:', error);
    res.status(500).json({ error: error?.message || 'Failed to estimate meal nutrition' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
