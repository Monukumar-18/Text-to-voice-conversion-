import React from 'react';
import {
  Flame,
  Droplets,
  Footprints,
  TrendingDown,
  TrendingUp,
  Target,
  Dumbbell,
  Apple,
  Sparkles,
  Plus,
  Minus,
} from 'lucide-react';
import { GoalSettings, MealEntry, WorkoutEntry } from '../types/fitness';

interface DashboardProps {
  goals: GoalSettings;
  meals: MealEntry[];
  workouts: WorkoutEntry[];
  waterMl: number;
  steps: number;
  weightKg: number;
  onUpdateWater: (amount: number) => void;
  onUpdateSteps: (amount: number) => void;
  onOpenAddMeal: () => void;
  onOpenAddWorkout: () => void;
  onGenerateInsights: () => void;
  onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  goals,
  meals,
  workouts,
  waterMl,
  steps,
  weightKg,
  onUpdateWater,
  onUpdateSteps,
  onOpenAddMeal,
  onOpenAddWorkout,
  onGenerateInsights,
  onOpenSettings,
}) => {
  // Aggregate nutrition
  const totalCaloriesIn = meals.reduce((sum, m) => sum + (m.totalCalories || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.totalProtein || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.totalCarbs || 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (m.totalFat || 0), 0);

  // Aggregate active workout burn
  const totalCaloriesBurned = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
  const totalWorkoutMinutes = workouts.reduce((sum, w) => sum + (w.durationMinutes || 0), 0);

  // Remaining metrics
  const remainingCalories = goals.targetCalories - totalCaloriesIn;
  const netCalories = totalCaloriesIn - totalCaloriesBurned;

  // Percentages capped at 100% for progress bars, with actual numbers shown
  const caloriePercent = Math.min(100, Math.round((totalCaloriesIn / goals.targetCalories) * 100));
  const proteinPercent = Math.min(100, Math.round((totalProtein / goals.targetProtein) * 100));
  const carbsPercent = Math.min(100, Math.round((totalCarbs / goals.targetCarbs) * 100));
  const fatPercent = Math.min(100, Math.round((totalFat / goals.targetFat) * 100));
  const waterPercent = Math.min(100, Math.round((waterMl / goals.targetWaterMl) * 100));
  const stepsPercent = Math.min(100, Math.round((steps / goals.targetSteps) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            ACTIVE TRACKING • TODAY'S METRICS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Personal Fitness & Fuel Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Goal: <span className="text-white font-medium capitalize">{goals.goalType.replace('_', ' ')}</span> • Target Weight: <span className="text-white font-medium">{goals.targetWeight} kg</span> ({Math.abs(weightKg - goals.targetWeight).toFixed(1)} kg to go)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenAddMeal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700/80 transition-all active:scale-95 shadow-sm"
          >
            <Apple className="w-3.5 h-3.5 text-emerald-400" />
            <span>Log Food</span>
          </button>

          <button
            onClick={onOpenAddWorkout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700/80 transition-all active:scale-95 shadow-sm"
          >
            <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
            <span>Log Workout</span>
          </button>

          <button
            onClick={onGenerateInsights}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily AI Insight</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid: Calories, Macros, Water, Burn */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Energy & Calorie Goal */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              Daily Calorie Target
            </span>
            <button
              onClick={onOpenSettings}
              className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-mono"
            >
              <Target className="w-3 h-3" />
              Edit Target
            </button>
          </div>

          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-3xl font-black text-white font-mono tracking-tight">
                {totalCaloriesIn}
                <span className="text-sm font-sans font-normal text-slate-400 ml-1">/ {goals.targetCalories} kcal</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {remainingCalories >= 0 ? (
                  <span className="text-emerald-400 font-medium font-mono">{remainingCalories} kcal remaining</span>
                ) : (
                  <span className="text-rose-400 font-medium font-mono">{Math.abs(remainingCalories)} kcal surplus</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {caloriePercent}%
              </span>
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${caloriePercent}%` }}
            />
          </div>

          {/* Calorie Balance details */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 block">Food Intake</span>
              <span className="text-slate-200 font-mono font-medium">+{totalCaloriesIn} kcal</span>
            </div>
            <div>
              <span className="text-slate-500 block">Active Burn</span>
              <span className="text-cyan-400 font-mono font-medium">-{totalCaloriesBurned} kcal</span>
            </div>
          </div>
        </div>

        {/* Card 2: Macronutrient Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Macronutrient Targets
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              P / C / F Balance
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Protein */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Protein
                </span>
                <span className="font-mono text-slate-200">
                  <strong className="text-white">{totalProtein}g</strong> / {goals.targetProtein}g ({proteinPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Carbohydrates
                </span>
                <span className="font-mono text-slate-200">
                  <strong className="text-white">{totalCarbs}g</strong> / {goals.targetCarbs}g ({carbsPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
            </div>

            {/* Fats */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  Fats
                </span>
                <span className="font-mono text-slate-200">
                  <strong className="text-white">{totalFat}g</strong> / {goals.targetFat}g ({fatPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between">
            <span>Remaining: {(goals.targetProtein - totalProtein).toFixed(0)}g P</span>
            <span>{(goals.targetCarbs - totalCarbs).toFixed(0)}g C</span>
            <span>{(goals.targetFat - totalFat).toFixed(0)}g F</span>
          </div>
        </div>

        {/* Card 3: Water & Step Hydration Trackers */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Hydration & Activity
            </span>
            <span className="text-[11px] text-cyan-400 font-mono">
              {waterPercent}% Reached
            </span>
          </div>

          {/* Water Intake Section */}
          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-1.5">
              <div>
                <span className="text-2xl font-black text-white font-mono">{waterMl}</span>
                <span className="text-xs text-slate-400 font-mono"> / {goals.targetWaterMl} ml</span>
              </div>
              {/* Quick Water Increment Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onUpdateWater(250)}
                  className="px-2 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 text-xs font-semibold transition-colors"
                  title="Add 250ml glass of water"
                >
                  +250ml
                </button>
                <button
                  onClick={() => onUpdateWater(500)}
                  className="px-2 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 text-xs font-semibold transition-colors"
                  title="Add 500ml water bottle"
                >
                  +500ml
                </button>
                {waterMl > 0 && (
                  <button
                    onClick={() => onUpdateWater(-250)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Remove 250ml"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>
          </div>

          {/* Steps & Active Movement */}
          <div className="pt-3 border-t border-slate-800/80">
            <div className="flex items-baseline justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                <span>Daily Steps:</span>
                <span className="font-mono font-bold text-white">{steps.toLocaleString()}</span>
                <span className="text-slate-500 font-mono">/ {goals.targetSteps.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateSteps(1000)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-mono"
                >
                  +1k
                </button>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${stepsPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar: Workout summary & Weight Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Active Training
          </span>
          <div className="text-xl font-bold text-white font-mono flex items-baseline gap-1">
            {totalWorkoutMinutes} <span className="text-xs font-normal text-slate-400 font-sans">mins</span>
          </div>
          <span className="text-[11px] text-cyan-400 mt-0.5 block">
            {workouts.length} session{workouts.length === 1 ? '' : 's'} today
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Active Calorie Burn
          </span>
          <div className="text-xl font-bold text-white font-mono flex items-baseline gap-1">
            {totalCaloriesBurned} <span className="text-xs font-normal text-slate-400 font-sans">kcal</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-0.5 block">
            Energy output logged
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Current Scale Weight
          </span>
          <div className="text-xl font-bold text-white font-mono flex items-baseline gap-1">
            {weightKg} <span className="text-xs font-normal text-slate-400 font-sans">kg</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block flex items-center gap-1">
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            -0.8 kg this week
          </span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Net Energy Balance
          </span>
          <div className="text-xl font-bold text-white font-mono flex items-baseline gap-1">
            {netCalories} <span className="text-xs font-normal text-slate-400 font-sans">kcal</span>
          </div>
          <span className="text-[11px] text-amber-400 mt-0.5 block">
            Intake - Exercise Burn
          </span>
        </div>
      </div>
    </div>
  );
};
