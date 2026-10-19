import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Utensils,
  RefreshCw,
  HeartPulse,
  Droplet,
  Zap,
} from 'lucide-react';
import { DailyNutritionalInsight, CoachVoice } from '../types/fitness';

interface NutritionalInsightsProps {
  insight: DailyNutritionalInsight | null;
  isLoading: boolean;
  onRefresh: () => void;
  onPlaySpeech: (text: string) => void;
  selectedCoach: CoachVoice;
}

export const NutritionalInsights: React.FC<NutritionalInsightsProps> = ({
  insight,
  isLoading,
  onRefresh,
  onPlaySpeech,
  selectedCoach,
}) => {
  const [copied, setCopied] = useState(false);

  if (!insight && !isLoading) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          No Daily Nutritional Insights Generated Yet
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
          Click the button below to have Gemini analyze today's logged meals, macro balance, hydration, and workout expenditure.
        </p>
        <button
          onClick={onRefresh}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          Generate Daily Nutritional Insight
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              AI Sports Nutrition Engine
            </span>
            {insight?.generatedAt && (
              <span className="text-[11px] text-slate-500">
                • Updated {new Date(insight.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Daily Nutritional & Performance Insights
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {insight?.spokenBriefing && (
            <button
              onClick={() => onPlaySpeech(insight.spokenBriefing)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              title="Listen to this briefing with Gemini 3.8 Flash TTS"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen ({selectedCoach.displayName})</span>
            </button>
          )}

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 px-3"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">{isLoading ? 'Analyzing...' : 'Re-analyze'}</span>
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-10 text-center animate-pulse">
          <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">Synthesizing Nutritional Bioenergetics...</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Reviewing amino acid pacing, glycogen recovery balance, and hydration adequacy...
          </p>
        </div>
      )}

      {insight && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main 2-column detailed analysis */}
          <div className="lg:col-span-2 space-y-4">
            {/* Headline Card with Score */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                    Daily Assessment
                  </span>
                  <p className="text-base sm:text-lg font-semibold text-slate-100 leading-snug">
                    "{insight.summary}"
                  </p>
                </div>
                {/* Score badge */}
                <div className="flex flex-col items-center justify-center min-w-20 p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-mono text-slate-400">Score</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {insight.nutritionScore}
                  </span>
                  <span className="text-[10px] text-slate-500">/ 100</span>
                </div>
              </div>
            </div>

            {/* Deep Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Macro Analysis */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4.5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  Macro Distribution & Fuel
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {insight.macroAnalysis}
                </p>
              </div>

              {/* Workout Recovery Synergy */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4.5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  <HeartPulse className="w-4 h-4" />
                  Training & Glycogen Synergy
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {insight.workoutSynergy}
                </p>
              </div>
            </div>

            {/* Hydration & Micronutrient Tip */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                <Droplet className="w-4 h-4" />
                Hydration & Cellular Electrolytes
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {insight.hydrationVerdict}
              </p>
            </div>

            {/* Actionable Recommendations */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">
                <Lightbulb className="w-4 h-4" />
                Key Action Steps For Today
              </div>
              <ul className="space-y-2.5">
                {insight.recommendations?.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right column: Evening meal suggestion & Audio Briefing Script */}
          <div className="space-y-4">
            {/* Recommended Evening Snack / Dinner */}
            <div className="bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                <Utensils className="w-4 h-4" />
                Suggested Evening Fuel
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {insight.eveningMealSuggestion}
              </p>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
                💡 <span className="text-slate-200 font-medium">Why this works:</span> Balances slow-release amino acids before nocturnal muscle repair.
              </div>
            </div>

            {/* Spoken Briefing Script Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  Spoken Coach Script
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                  TTS Script
                </span>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-3 font-serif">
                "{insight.spokenBriefing}"
              </p>
              <button
                onClick={() => onPlaySpeech(insight.spokenBriefing)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <Volume2 className="w-4 h-4 fill-current" />
                Listen with {selectedCoach.displayName}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
