import { DailyNutritionalInsight, GoalSettings, MealEntry, WorkoutEntry } from '../types/fitness';

export interface TTSRequest {
  text: string;
  voice?: 'Puck' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Charon';
  coachStyle?: string;
  coachName?: string;
}

export interface TTSResponse {
  audioBase64?: string;
  mimeType?: string;
  voice: string;
  text: string;
  fallbackUsed?: boolean;
}

export async function requestTTS(params: TTSRequest): Promise<TTSResponse> {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `TTS request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn('Backend TTS failed, checking fallback:', error);
    throw error;
  }
}

export interface GenerateInsightsParams {
  goals: GoalSettings;
  meals: MealEntry[];
  workouts: WorkoutEntry[];
  waterMl: number;
  weightKg: number;
  streakDays: number;
}

export async function requestDailyInsights(
  params: GenerateInsightsParams
): Promise<DailyNutritionalInsight> {
  const response = await fetch('/api/insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error || `Insight request failed (${response.status})`);
  }

  const data = await response.json();
  return {
    ...data,
    generatedAt: new Date().toISOString(),
  };
}

export interface EstimatedMealResult {
  mealName: string;
  items: Array<{
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  }>;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  quickTip: string;
}

export async function estimateMealFromText(query: string): Promise<EstimatedMealResult> {
  const response = await fetch('/api/estimate-meal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error || `Meal estimate failed (${response.status})`);
  }

  return await response.json();
}
