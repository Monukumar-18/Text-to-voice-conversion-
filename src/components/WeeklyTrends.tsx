import React from 'react';
import { TrendingDown, Flame, Award, CheckCircle, Calendar } from 'lucide-react';
import { GoalSettings } from '../types/fitness';

interface WeeklyTrendsProps {
  goals: GoalSettings;
}

export const WeeklyTrends: React.FC<WeeklyTrendsProps> = ({ goals }) => {
  // 7-day sample trend points
  const weekData = [
    { day: 'Mon', calories: 2150, burned: 520, weight: 75.8, workout: 'Upper Strength', metGoal: true },
    { day: 'Tue', calories: 2280, burned: 610, weight: 75.6, workout: 'Intervals & Abs', metGoal: true },
    { day: 'Wed', calories: 2050, burned: 350, weight: 75.5, workout: 'Zone 2 Run', metGoal: true },
    { day: 'Thu', calories: 2350, burned: 700, weight: 75.6, workout: 'Leg Day & HIIT', metGoal: true },
    { day: 'Fri', calories: 2180, burned: 480, weight: 75.4, workout: 'Pull & Core', metGoal: true },
    { day: 'Sat', calories: 2420, burned: 650, weight: 75.3, workout: 'Long Outdoor Bike', metGoal: false },
    { day: 'Sun', calories: 2100, burned: 650, weight: 75.4, workout: 'Chest & Zone 2', metGoal: true },
  ];

  const daysMet = weekData.filter((d) => d.metGoal).length;
  const adherenceRate = Math.round((daysMet / weekData.length) * 100);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              7-Day Macro & Activity Trend
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">Consistency & Body Composition</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">Weekly Goal Adherence:</span>
            <span className="font-bold text-emerald-400 font-mono">{adherenceRate}%</span>
          </div>
        </div>
      </div>

      {/* Visual Chart Bars */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
          <span className="font-semibold text-slate-300">Daily Calorie Intake vs Burn</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Intake (kcal)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Active Burn
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 font-mono">
              Target: {goals.targetCalories} kcal
            </span>
          </div>
        </div>

        {/* Bar chart row */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4">
          {weekData.map((d, i) => {
            const maxCal = 3000;
            const intakeHeight = Math.min(100, (d.calories / maxCal) * 100);
            const burnHeight = Math.min(100, (d.burned / 1000) * 100);

            return (
              <div key={d.day} className="flex flex-col items-center gap-2">
                {/* Bar visual */}
                <div className="w-full bg-slate-950 rounded-xl h-44 p-1.5 flex items-end justify-center gap-1.5 relative group border border-slate-800/80 hover:border-slate-700 transition-all">
                  {/* Target reference dashed mark */}
                  <div
                    className="absolute w-full left-0 border-t border-dashed border-slate-700/80 z-10"
                    style={{ bottom: `${(goals.targetCalories / maxCal) * 100}%` }}
                    title={`Target: ${goals.targetCalories} kcal`}
                  />

                  {/* Intake bar */}
                  <div
                    className="w-1/2 bg-gradient-to-t from-emerald-600 to-teal-400 rounded-lg transition-all duration-500 group-hover:brightness-110"
                    style={{ height: `${intakeHeight}%` }}
                    title={`${d.day} Intake: ${d.calories} kcal`}
                  />

                  {/* Burn bar */}
                  <div
                    className="w-1/2 bg-gradient-to-t from-cyan-600 to-blue-400 rounded-lg transition-all duration-500 group-hover:brightness-110"
                    style={{ height: `${burnHeight}%` }}
                    title={`${d.day} Burn: ${d.burned} kcal`}
                  />
                </div>

                {/* Day label and weight */}
                <div className="text-center">
                  <span className="text-xs font-semibold text-slate-300 block">{d.day}</span>
                  <span className="text-[10px] font-mono text-slate-500 block">{d.weight}kg</span>
                  <span className="text-[10px] font-mono text-emerald-400 block">{d.calories}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Week Takeaway Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4.5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">
              Metabolic Deficit Maintenance
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your average weekly deficit was approximately -410 kcal/day. This equates to safe, steady fat loss of ~0.4 kg pure adipose tissue per week while preserving lean muscle mass.
            </p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4.5 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">
              Training Density
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Logged 6 training sessions across 7 days totaling 3,960 active burned kcal. Workout adherence was highest on mornings following high-complex-carb dinners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
