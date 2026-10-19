import React from 'react';
import {
  Activity,
  Flame,
  Apple,
  Dumbbell,
  Sparkles,
  BarChart3,
  Sliders,
  Volume2,
  Calendar,
} from 'lucide-react';
import { CoachVoice } from '../types/fitness';

interface NavbarProps {
  currentTab: 'dashboard' | 'meals' | 'workouts' | 'insights' | 'trends';
  onSelectTab: (tab: 'dashboard' | 'meals' | 'workouts' | 'insights' | 'trends') => void;
  selectedCoach: CoachVoice;
  onOpenSettings: () => void;
  onQuickBriefing: () => void;
  currentDateStr: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  selectedCoach,
  onOpenSettings,
  onQuickBriefing,
  currentDateStr,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onSelectTab('dashboard')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 font-black">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white">
                  Pulse<span className="text-emerald-400">Fit</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  TTS Coach 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Precision Fitness & Nutritional Bioenergetics
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onSelectTab('meals')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'meals'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>Meals & Macros</span>
            </button>

            <button
              onClick={() => onSelectTab('workouts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'workouts'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Workouts</span>
            </button>

            <button
              onClick={() => onSelectTab('insights')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'insights'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Insights</span>
            </button>

            <button
              onClick={() => onSelectTab('trends')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'trends'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>7-Day Trends</span>
            </button>
          </nav>

          {/* Right Action Tools: Date, Audio Coach Quick Trigger, Target Settings */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Today Date Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentDateStr}</span>
            </div>

            {/* Coach Voice Button */}
            <button
              onClick={onQuickBriefing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold transition-colors active:scale-95"
              title="Listen to today's coach briefing via Gemini 3.8 Flash TTS"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{selectedCoach.displayName}</span>
              <span className="sm:hidden">Coach</span>
            </button>

            {/* Goals Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Personal Goal Targets"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-2.5 py-1 rounded-lg ${
              currentTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('meals')}
            className={`px-2.5 py-1 rounded-lg ${
              currentTab === 'meals' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            Meals
          </button>
          <button
            onClick={() => onSelectTab('workouts')}
            className={`px-2.5 py-1 rounded-lg ${
              currentTab === 'workouts' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            Workouts
          </button>
          <button
            onClick={() => onSelectTab('insights')}
            className={`px-2.5 py-1 rounded-lg ${
              currentTab === 'insights' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            Insights
          </button>
          <button
            onClick={() => onSelectTab('trends')}
            className={`px-2.5 py-1 rounded-lg ${
              currentTab === 'trends' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            Trends
          </button>
        </div>
      </div>
    </header>
  );
};
