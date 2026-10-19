import React, { useState } from 'react';
import {
  Dumbbell,
  Plus,
  Trash2,
  Flame,
  Clock,
  Heart,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react';
import { WorkoutEntry, WorkoutType } from '../types/fitness';

interface WorkoutTrackerProps {
  workouts: WorkoutEntry[];
  onAddWorkout: (workout: WorkoutEntry) => void;
  onDeleteWorkout: (id: string) => void;
  streakDays: number;
}

const WORKOUT_TYPE_OPTIONS: Array<{
  type: WorkoutType;
  label: string;
  icon: string;
  defaultBurnPerMin: number;
}> = [
  { type: 'weightlifting', label: 'Weightlifting / Gym', icon: '🏋️', defaultBurnPerMin: 7.5 },
  { type: 'running', label: 'Outdoor / Treadmill Run', icon: '🏃', defaultBurnPerMin: 11.0 },
  { type: 'hiit', label: 'HIIT / Circuit Training', icon: '⚡', defaultBurnPerMin: 12.0 },
  { type: 'cycling', label: 'Cycling / Spin', icon: '🚴', defaultBurnPerMin: 8.5 },
  { type: 'swimming', label: 'Swimming Laps', icon: '🏊', defaultBurnPerMin: 9.0 },
  { type: 'yoga', label: 'Yoga / Mobility', icon: '🧘', defaultBurnPerMin: 4.0 },
  { type: 'walking', label: 'Brisk Walk', icon: '🚶', defaultBurnPerMin: 4.5 },
  { type: 'sports', label: 'Basketball / Tennis / Soccer', icon: '⚽', defaultBurnPerMin: 9.5 },
];

export const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({
  workouts,
  onAddWorkout,
  onDeleteWorkout,
  streakDays,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<WorkoutType>('weightlifting');
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [caloriesBurned, setCaloriesBurned] = useState<number | ''>('');
  const [intensity, setIntensity] = useState<'light' | 'moderate' | 'high' | 'peak'>('high');
  const [heartRateAvg, setHeartRateAvg] = useState('');
  const [notes, setNotes] = useState('');

  // Auto calculate burn based on duration and intensity if not manually typed
  const calculateDefaultBurn = (type: WorkoutType, mins: number, level: string) => {
    const matched = WORKOUT_TYPE_OPTIONS.find((w) => w.type === type);
    const base = matched ? matched.defaultBurnPerMin : 8;
    const mult = level === 'light' ? 0.8 : level === 'moderate' ? 1.0 : level === 'high' ? 1.25 : 1.45;
    return Math.round(base * mins * mult);
  };

  const handleOpenModal = () => {
    const defaultMins = 45;
    const est = calculateDefaultBurn('weightlifting', defaultMins, 'high');
    setSelectedType('weightlifting');
    setTitle('');
    setDurationMinutes(defaultMins);
    setCaloriesBurned(est);
    setIntensity('high');
    setHeartRateAvg('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleDurationOrIntensityChange = (
    type: WorkoutType,
    mins: number,
    level: 'light' | 'moderate' | 'high' | 'peak'
  ) => {
    const est = calculateDefaultBurn(type, mins, level);
    setCaloriesBurned(est);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalBurn =
      typeof caloriesBurned === 'number' && caloriesBurned > 0
        ? caloriesBurned
        : calculateDefaultBurn(selectedType, durationMinutes, intensity);

    const typeMeta = WORKOUT_TYPE_OPTIONS.find((w) => w.type === selectedType);
    const newWorkout: WorkoutEntry = {
      id: `w-${Date.now()}`,
      type: selectedType,
      title: title.trim() || `${typeMeta?.label || 'Workout'} Session`,
      durationMinutes: Number(durationMinutes) || 30,
      caloriesBurned: finalBurn,
      intensity,
      heartRateAvg: heartRateAvg ? Number(heartRateAvg) : undefined,
      notes: notes.trim() || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onAddWorkout(newWorkout);
    setIsModalOpen(false);
  };

  const totalBurn = workouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const totalMins = workouts.reduce((acc, w) => acc + w.durationMinutes, 0);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Daily Workout & Activity Logger</h2>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Flame className="w-3 h-3 fill-amber-400" />
                {streakDays} Day Streak!
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Track your resistance training, cardio, and metabolic conditioning.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Log Workout</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Active Time</span>
          <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
            {totalMins} <span className="text-xs font-normal text-slate-400 font-sans">minutes</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Active Caloric Burn</span>
          <div className="text-2xl font-black text-cyan-400 font-mono flex items-baseline gap-1">
            {totalBurn} <span className="text-xs font-normal text-slate-400 font-sans">kcal</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Completed Sessions</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {workouts.length}
          </div>
        </div>
      </div>

      {/* Workouts List */}
      {workouts.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-10 text-center">
          <Dumbbell className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-300">No workouts logged yet today</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">Record your training to see accurate metabolic burn and nutritional recovery suggestions.</p>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            Add First Workout
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0">
                  {WORKOUT_TYPE_OPTIONS.find((w) => w.type === workout.type)?.icon || '🏋️'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      {workout.title}
                    </h3>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {workout.intensity}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {workout.durationMinutes} mins
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Flame className="w-3 h-3 fill-amber-400" />
                      {workout.caloriesBurned} kcal
                    </span>
                    {workout.heartRateAvg && (
                      <span className="flex items-center gap-1 text-rose-400">
                        <Heart className="w-3 h-3 fill-rose-400" />
                        {workout.heartRateAvg} bpm
                      </span>
                    )}
                    <span className="text-slate-500">at {workout.timestamp}</span>
                  </div>

                  {workout.notes && (
                    <p className="text-xs text-slate-400 mt-2 bg-slate-950/50 px-2.5 py-1.5 rounded-lg border border-slate-800/60 font-sans">
                      {workout.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onDeleteWorkout(workout.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete workout"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Workout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Log Training Session</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Workout Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Exercise Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {WORKOUT_TYPE_OPTIONS.map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => {
                        setSelectedType(item.type);
                        handleDurationOrIntensityChange(item.type, durationMinutes, intensity);
                      }}
                      className={`p-2 rounded-xl text-left border text-xs transition-colors ${
                        selectedType === item.type
                          ? 'border-cyan-500 bg-cyan-500/10 text-white font-medium'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-base block mb-0.5">{item.icon}</span>
                      <span className="line-clamp-1">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Routine Name / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Legs & Core, 5km Tempo Run, Push Day"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Duration and Intensity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={360}
                    value={durationMinutes}
                    onChange={(e) => {
                      const mins = Number(e.target.value) || 0;
                      setDurationMinutes(mins);
                      handleDurationOrIntensityChange(selectedType, mins, intensity);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Intensity Level
                  </label>
                  <select
                    value={intensity}
                    onChange={(e) => {
                      const level = e.target.value as any;
                      setIntensity(level);
                      handleDurationOrIntensityChange(selectedType, durationMinutes, level);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                  >
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="high">High</option>
                    <option value="peak">Peak / Max Effort</option>
                  </select>
                </div>
              </div>

              {/* Calories Burned and Avg HR */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Calories Burned</span>
                    <span className="text-[10px] text-slate-500">Auto-estimated</span>
                  </label>
                  <input
                    type="number"
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-amber-400 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Avg Heart Rate (BPM)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 145"
                    value={heartRateAvg}
                    onChange={(e) => setHeartRateAvg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-rose-300 font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes / Sets / Milestones
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Squat 4x5 @ 120kg, RDL 3x8, felt high energy"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                >
                  Save Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
