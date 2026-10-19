import { CoachVoice, GoalSettings, MealEntry, WorkoutEntry, DailyNutritionalInsight } from '../types/fitness';

export const DEFAULT_GOALS: GoalSettings = {
  targetCalories: 2200,
  targetProtein: 155,
  targetCarbs: 225,
  targetFat: 65,
  targetWaterMl: 3000,
  targetSteps: 10000,
  currentWeight: 75.4,
  targetWeight: 72.0,
  goalType: 'lose_fat',
  activityLevel: 'moderately_active',
};

export const COACH_VOICES: CoachVoice[] = [
  {
    id: 'puck',
    voiceName: 'Puck',
    displayName: 'Coach Puck',
    title: 'High-Energy Athletic Trainer',
    personality: 'Vibrant, fast-paced, hype & relentless drive',
    styleDescription: 'Enthusiastic, energetic personal trainer with punchy motivation',
    badge: 'Hype Coach',
    accentColor: 'from-amber-400 to-orange-500',
  },
  {
    id: 'kore',
    voiceName: 'Kore',
    displayName: 'Coach Kore',
    title: 'Holistic Nutrition & Wellness Guide',
    personality: 'Warm, empathetic, grounded & clear science educator',
    styleDescription: 'Warm, supportive clinical sports dietitian and habit coach',
    badge: 'Nutritionist',
    accentColor: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'zephyr',
    voiceName: 'Zephyr',
    displayName: 'Coach Zephyr',
    title: 'Biometrics & Recovery Scientist',
    personality: 'Calm, measured, data-driven performance coach',
    styleDescription: 'Calm, articulate sports physiologist focusing on bioenergetics',
    badge: 'Physiologist',
    accentColor: 'from-cyan-400 to-blue-500',
  },
  {
    id: 'fenrir',
    voiceName: 'Fenrir',
    displayName: 'Coach Fenrir',
    title: 'Strength & Hypertrophy Specialist',
    personality: 'Grounded, commanding, disciplined heavy lifter',
    styleDescription: 'Deep, confident, focused strength and conditioning coach',
    badge: 'Iron Mentor',
    accentColor: 'from-purple-400 to-indigo-600',
  },
];

export const COMMON_FOOD_PRESETS = [
  { name: 'Rolled Oats with Berries & Honey', portion: '1 bowl (80g dry)', calories: 340, protein: 11, carbs: 62, fat: 5, fiber: 8, mealType: 'breakfast' as const },
  { name: 'Liquid Egg Whites & 2 Whole Eggs Scramble', portion: '3 eggs eq', calories: 240, protein: 26, carbs: 2, fat: 12, fiber: 0, mealType: 'breakfast' as const },
  { name: '0% Fat Greek Yogurt with Blueberries', portion: '200g bowl', calories: 160, protein: 22, carbs: 14, fat: 0, fiber: 3, mealType: 'breakfast' as const },
  { name: 'Grilled Herb Chicken Breast & Quinoa', portion: '200g chicken, 150g quinoa', calories: 480, protein: 48, carbs: 42, fat: 9, fiber: 6, mealType: 'lunch' as const },
  { name: 'Atlantic Salmon, Sweet Potato & Asparagus', portion: '1 fillet, 1 medium potato', calories: 540, protein: 42, carbs: 45, fat: 18, fiber: 7, mealType: 'dinner' as const },
  { name: 'Lean Grass-Fed Beef Bowl with Jasmine Rice', portion: '180g beef, 180g rice', calories: 590, protein: 46, carbs: 54, fat: 16, fiber: 2, mealType: 'lunch' as const },
  { name: 'Whey Isolate Protein Shake with Almond Milk', portion: '1 scoop (35g)', calories: 155, protein: 28, carbs: 3, fat: 2, fiber: 1, mealType: 'snack' as const },
  { name: 'Whole Grain Toast with Half Avocado', portion: '2 slices + 70g avo', calories: 310, protein: 9, carbs: 32, fat: 16, fiber: 8, mealType: 'breakfast' as const },
  { name: 'Raw Mixed Almonds & Walnuts', portion: 'Handful (30g)', calories: 195, protein: 6, carbs: 6, fat: 17, fiber: 4, mealType: 'snack' as const },
  { name: 'Turkey Breast Wrap with Spinach & Hummus', portion: '1 large wrap', calories: 410, protein: 34, carbs: 40, fat: 11, fiber: 5, mealType: 'lunch' as const },
];

export const INITIAL_MEALS: MealEntry[] = [
  {
    id: 'm-1',
    mealType: 'breakfast',
    name: 'Power Oats & Scrambled Eggs',
    time: '08:15 AM',
    items: [
      { id: 'fi-1', name: 'Rolled Oats with Cinnamon & Chia', portion: '75g', calories: 310, protein: 11, carbs: 54, fat: 6, fiber: 9 },
      { id: 'fi-2', name: '3 Scrambled Eggs with Olive Oil', portion: '3 eggs', calories: 230, protein: 19, carbs: 2, fat: 16, fiber: 0 },
      { id: 'fi-3', name: 'Black Espresso', portion: '1 cup', calories: 5, protein: 0, carbs: 1, fat: 0 },
    ],
    totalCalories: 545,
    totalProtein: 30,
    totalCarbs: 57,
    totalFat: 22,
  },
  {
    id: 'm-2',
    mealType: 'lunch',
    name: 'Grilled Lemon Herb Chicken & Quinoa',
    time: '01:00 PM',
    items: [
      { id: 'fi-4', name: 'Grilled Chicken Breast', portion: '200g', calories: 330, protein: 48, carbs: 0, fat: 5, fiber: 0 },
      { id: 'fi-5', name: 'Steamed Tricolor Quinoa', portion: '160g cooked', calories: 210, protein: 8, carbs: 36, fat: 3, fiber: 5 },
      { id: 'fi-6', name: 'Steamed Broccoli with Garlic', portion: '120g', calories: 45, protein: 3, carbs: 8, fat: 1, fiber: 4 },
    ],
    totalCalories: 585,
    totalProtein: 59,
    totalCarbs: 44,
    totalFat: 9,
  },
  {
    id: 'm-3',
    mealType: 'snack',
    name: 'Post-Workout Fuel',
    time: '04:30 PM',
    items: [
      { id: 'fi-7', name: 'Whey Protein Isolate Shake', portion: '1 scoop with water', calories: 130, protein: 27, carbs: 2, fat: 1 },
      { id: 'fi-8', name: 'Fresh Banana', portion: '1 medium (118g)', calories: 105, protein: 1, carbs: 27, fat: 0, fiber: 3 },
    ],
    totalCalories: 235,
    totalProtein: 28,
    totalCarbs: 29,
    totalFat: 1,
  },
];

export const INITIAL_WORKOUTS: WorkoutEntry[] = [
  {
    id: 'w-1',
    type: 'weightlifting',
    title: 'Upper Body Hypertrophy (Chest & Back)',
    durationMinutes: 52,
    caloriesBurned: 390,
    intensity: 'high',
    heartRateAvg: 138,
    notes: 'DB Incline Press, Weighted Pull-ups, Seated Cable Rows & Lateral Raises.',
    timestamp: '07:00 AM',
  },
  {
    id: 'w-2',
    type: 'running',
    title: 'Zone 2 Aerobic Flush Run',
    durationMinutes: 28,
    caloriesBurned: 260,
    intensity: 'moderate',
    heartRateAvg: 142,
    notes: 'Steady cadence recovery run outdoors.',
    timestamp: '03:45 PM',
  },
];

export const INITIAL_INSIGHT: DailyNutritionalInsight = {
  summary: 'Exceptional protein pacing and training synergy; hydration is trailing slightly for afternoon demands.',
  nutritionScore: 89,
  macroAnalysis: 'You have logged 117g of your 155g daily protein goal across 3 evenly distributed feedings. Carbohydrate intake (130g / 225g) is on pace to support your muscle glycogen replenishment without spilling over into excess caloric surplus.',
  workoutSynergy: 'Your upper body strength session and Zone 2 run burned roughly 650 active calories. The 4:30 PM post-workout whey and banana combination provided immediate spike in leucine and rapid glucose for muscle protein synthesis.',
  hydrationVerdict: 'You have logged 1,850 ml of your 3,000 ml water target. Because of the running sweat loss, aim for another 750-1,000 ml with a pinch of electrolytes before 8:30 PM.',
  recommendations: [
    'Prioritize 35-40g of slow-digesting casein or salmon with roasted vegetables for dinner.',
    'Drink 500ml of water right now to compensate for afternoon sweat rate.',
    'Keep dietary fat around 15-20g at dinner to hit your 65g optimal hormonal lipid floor.',
  ],
  eveningMealSuggestion: 'Baked wild salmon (180g) with roasted asparagus and sweet potato wedges. This supplies ~38g protein, healthy omega-3s for joint recovery, and meets your calorie deficit.',
  spokenBriefing: "Coach Puck here! <breath> You crushed today's lift and that Zone 2 run. |yeah| Your protein distribution is spot on at 117 grams so far! Just make sure to slam another bottle of water before dinner, and cap the night off with a clean dinner to lock in those gains. Let's finish strong!",
  generatedAt: new Date().toISOString(),
};
