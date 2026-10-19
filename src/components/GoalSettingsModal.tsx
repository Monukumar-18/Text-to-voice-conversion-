import React, { useState } from 'react';
import { Target, Scale, Droplets, Footprints, Flame, Check, Sparkles } from 'lucide-react';
import { GoalSettings, GoalType, ActivityLevel } from '../types/fitness';

interface GoalSettingsModalProps {
  goals: GoalSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: GoalSettings) => void;
}

export const GoalSettingsModal: React.FC<GoalSettingsModalProps> = ({
  goals,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<GoalSettings>({ ...goals });

  if (!isOpen) return null;

  const handleApplyPreset = (type: GoalType) => {
    let calories = 2200;
    let protein = 150;
    let carbs = 220;
    let fat = 65;

    if (type === 'lose_fat') {
      calories = 1950;
      protein = 165;
      carbs = 170;
      fat = 55;
    } else if (type === 'build_muscle') {
      calories = 2650;
      protein = 180;
      carbs = 310;
      fat = 75;
    } else if (type === 'endurance') {
      calories = 2450;
      protein = 140;
      carbs = 330;
      fat = 60;
    }

    setFormData((prev) => ({
      ...prev,
      goalType: type,
      targetCalories: calories,
      targetProtein: protein,
      targetCarbs: carbs,
      targetFat: fat,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Personal Fitness & Nutrition Targets
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            ✕
          </button>
        </div>

        {/* Quick Goal Presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Primary Fitness Objective
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'lose_fat', label: 'Fat Loss', desc: 'Caloric deficit, high protein' },
              { id: 'build_muscle', label: 'Hypertrophy', desc: 'Caloric surplus & growth' },
              { id: 'maintain', label: 'Maintenance', desc: 'Steady metabolic balance' },
              { id: 'endurance', label: 'Endurance', desc: 'High glycogen & stamina' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleApplyPreset(p.id as GoalType)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  formData.goalType === p.id
                    ? 'border-emerald-500 bg-emerald-500/10 text-white'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <span className="font-semibold text-xs block text-white">{p.label}</span>
                <span className="text-[10px] text-slate-500 line-clamp-1">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Caloric & Bodyweight targets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Target Calories (kcal)
              </label>
              <input
                type="number"
                min={1000}
                max={6000}
                value={formData.targetCalories}
                onChange={(e) =>
                  setFormData({ ...formData, targetCalories: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                Current Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.currentWeight}
                onChange={(e) =>
                  setFormData({ ...formData, currentWeight: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Goal Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.targetWeight}
                onChange={(e) =>
                  setFormData({ ...formData, targetWeight: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>
          </div>

          {/* Macronutrients Targets */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Daily Macronutrient Targets
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                P: {formData.targetProtein * 4}kcal • C: {formData.targetCarbs * 4}kcal • F: {formData.targetFat * 9}kcal
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-blue-400 font-semibold mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={formData.targetProtein}
                  onChange={(e) =>
                    setFormData({ ...formData, targetProtein: Number(e.target.value) })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-blue-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs text-amber-400 font-semibold mb-1">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={formData.targetCarbs}
                  onChange={(e) =>
                    setFormData({ ...formData, targetCarbs: Number(e.target.value) })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-amber-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs text-rose-400 font-semibold mb-1">
                  Fat (g)
                </label>
                <input
                  type="number"
                  value={formData.targetFat}
                  onChange={(e) =>
                    setFormData({ ...formData, targetFat: Number(e.target.value) })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-rose-300 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Hydration and Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                Daily Water Goal (ml)
              </label>
              <input
                type="number"
                step="100"
                value={formData.targetWaterMl}
                onChange={(e) =>
                  setFormData({ ...formData, targetWaterMl: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                Daily Step Target
              </label>
              <input
                type="number"
                step="500"
                value={formData.targetSteps}
                onChange={(e) =>
                  setFormData({ ...formData, targetSteps: Number(e.target.value) })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              Save Goals
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
