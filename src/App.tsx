import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { NutritionalInsights } from './components/NutritionalInsights';
import { MealTracker } from './components/MealTracker';
import { WorkoutTracker } from './components/WorkoutTracker';
import { WeeklyTrends } from './components/WeeklyTrends';
import { AudioCoachPlayer } from './components/AudioCoachPlayer';
import { GoalSettingsModal } from './components/GoalSettingsModal';
import {
  DEFAULT_GOALS,
  COACH_VOICES,
  INITIAL_MEALS,
  INITIAL_WORKOUTS,
  INITIAL_INSIGHT,
} from './data/defaultData';
import {
  CoachVoice,
  GoalSettings,
  MealEntry,
  WorkoutEntry,
  DailyNutritionalInsight,
} from './types/fitness';
import { requestDailyInsights } from './services/api';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<
    'dashboard' | 'meals' | 'workouts' | 'insights' | 'trends'
  >('dashboard');

  // Goals & Biometrics
  const [goals, setGoals] = useState<GoalSettings>(() => {
    const saved = localStorage.getItem('pulsefit_goals');
    return saved ? JSON.parse(saved) : DEFAULT_GOALS;
  });

  // Daily Logs
  const [meals, setMeals] = useState<MealEntry[]>(() => {
    const saved = localStorage.getItem('pulsefit_meals');
    return saved ? JSON.parse(saved) : INITIAL_MEALS;
  });

  const [workouts, setWorkouts] = useState<WorkoutEntry[]>(() => {
    const saved = localStorage.getItem('pulsefit_workouts');
    return saved ? JSON.parse(saved) : INITIAL_WORKOUTS;
  });

  const [waterMl, setWaterMl] = useState<number>(() => {
    const saved = localStorage.getItem('pulsefit_water');
    return saved ? Number(saved) : 1850;
  });

  const [steps, setSteps] = useState<number>(() => {
    const saved = localStorage.getItem('pulsefit_steps');
    return saved ? Number(saved) : 7420;
  });

  const [weightKg, setWeightKg] = useState<number>(goals.currentWeight || 75.4);
  const [streakDays] = useState<number>(5);

  // Nutritional Insights
  const [insight, setInsight] = useState<DailyNutritionalInsight | null>(() => {
    const saved = localStorage.getItem('pulsefit_insight');
    return saved ? JSON.parse(saved) : INITIAL_INSIGHT;
  });
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // Audio Coach (TTS)
  const [selectedCoach, setSelectedCoach] = useState<CoachVoice>(COACH_VOICES[0]);
  const [currentSpeechText, setCurrentSpeechText] = useState<string>(
    INITIAL_INSIGHT.spokenBriefing
  );
  const [audioError, setAudioError] = useState<string | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('pulsefit_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('pulsefit_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('pulsefit_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('pulsefit_water', String(waterMl));
  }, [waterMl]);

  useEffect(() => {
    localStorage.setItem('pulsefit_steps', String(steps));
  }, [steps]);

  useEffect(() => {
    if (insight) {
      localStorage.setItem('pulsefit_insight', JSON.stringify(insight));
    }
  }, [insight]);

  // Handlers for Food & Workout
  const handleAddMeal = (newMeal: MealEntry) => {
    setMeals((prev) => [newMeal, ...prev]);
  };

  const handleDeleteMeal = (mealId: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  const handleAddWorkout = (newWorkout: WorkoutEntry) => {
    setWorkouts((prev) => [newWorkout, ...prev]);
  };

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
  };

  const handleUpdateWater = (amount: number) => {
    setWaterMl((prev) => Math.max(0, prev + amount));
  };

  const handleUpdateSteps = (amount: number) => {
    setSteps((prev) => Math.max(0, prev + amount));
  };

  // AI Daily Nutritional Insights Generation
  const handleGenerateInsights = async () => {
    setIsLoadingInsight(true);
    setAudioError(null);

    try {
      const generated = await requestDailyInsights({
        goals,
        meals,
        workouts,
        waterMl,
        weightKg,
        streakDays,
      });

      setInsight(generated);
      if (generated.spokenBriefing) {
        setCurrentSpeechText(generated.spokenBriefing);
      }
      setCurrentTab('insights');
    } catch (err: any) {
      console.error('Error generating daily insights:', err);
      setAudioError(err.message || 'Could not generate AI insights.');
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const handlePlaySpeech = (text: string) => {
    setCurrentSpeechText(text);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        selectedCoach={selectedCoach}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onQuickBriefing={() => {
          if (insight?.spokenBriefing) {
            setCurrentSpeechText(insight.spokenBriefing);
          }
        }}
        currentDateStr={formattedDate}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Audio Coach Player Console - Prominent & Sticky */}
        <section aria-label="Audio Coach Console">
          <AudioCoachPlayer
            currentBriefingText={currentSpeechText}
            selectedCoach={selectedCoach}
            onSelectCoach={setSelectedCoach}
            onAudioError={(err) => setAudioError(err)}
          />
        </section>

        {/* Global Error Banner if any */}
        {audioError && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{audioError} (Browser voice fallback available)</span>
            </div>
            <button
              onClick={() => setAudioError(null)}
              className="text-amber-400 hover:text-white font-mono text-xs px-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Active Tab View */}
        {currentTab === 'dashboard' && (
          <Dashboard
            goals={goals}
            meals={meals}
            workouts={workouts}
            waterMl={waterMl}
            steps={steps}
            weightKg={weightKg}
            onUpdateWater={handleUpdateWater}
            onUpdateSteps={handleUpdateSteps}
            onOpenAddMeal={() => setCurrentTab('meals')}
            onOpenAddWorkout={() => setCurrentTab('workouts')}
            onGenerateInsights={handleGenerateInsights}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {currentTab === 'meals' && (
          <MealTracker
            meals={meals}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
          />
        )}

        {currentTab === 'workouts' && (
          <WorkoutTracker
            workouts={workouts}
            onAddWorkout={handleAddWorkout}
            onDeleteWorkout={handleDeleteWorkout}
            streakDays={streakDays}
          />
        )}

        {currentTab === 'insights' && (
          <NutritionalInsights
            insight={insight}
            isLoading={isLoadingInsight}
            onRefresh={handleGenerateInsights}
            onPlaySpeech={handlePlaySpeech}
            selectedCoach={selectedCoach}
          />
        )}

        {currentTab === 'trends' && <WeeklyTrends goals={goals} />}
      </main>

      {/* Target Settings Modal */}
      <GoalSettingsModal
        goals={goals}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(updated) => {
          setGoals(updated);
          setWeightKg(updated.currentWeight);
        }}
      />
    </div>
  );
}
