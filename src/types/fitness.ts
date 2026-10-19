export type GoalType = 'lose_fat' | 'build_muscle' | 'maintain' | 'endurance';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface GoalSettings {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetWaterMl: number;
  targetSteps: number;
  currentWeight: number;
  targetWeight: number;
  goalType: GoalType;
  activityLevel: ActivityLevel;
}

export interface FoodItem {
  id: string;
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface MealEntry {
  id: string;
  mealType: MealType;
  name: string;
  time: string;
  items: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export type WorkoutType =
  | 'running'
  | 'weightlifting'
  | 'cycling'
  | 'hiit'
  | 'swimming'
  | 'yoga'
  | 'walking'
  | 'sports'
  | 'other';

export interface WorkoutEntry {
  id: string;
  type: WorkoutType;
  title: string;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: 'light' | 'moderate' | 'high' | 'peak';
  heartRateAvg?: number;
  notes?: string;
  timestamp: string;
}

export interface DailyNutritionalInsight {
  summary: string;
  nutritionScore: number;
  macroAnalysis: string;
  workoutSynergy: string;
  hydrationVerdict: string;
  recommendations: string[];
  eveningMealSuggestion: string;
  spokenBriefing: string;
  generatedAt: string;
}

export interface CoachVoice {
  id: string;
  voiceName: 'Puck' | 'Kore' | 'Fenrir' | 'Zephyr' | 'Charon';
  displayName: string;
  title: string;
  personality: string;
  styleDescription: string;
  badge: string;
  accentColor: string;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  meals: MealEntry[];
  workouts: WorkoutEntry[];
  waterMl: number;
  steps: number;
  weightKg: number;
  insight?: DailyNutritionalInsight;
}
