import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Sparkles,
  Search,
  Clock,
  Apple,
  UtensilsCrossed,
  ChefHat,
  Loader2,
  Check,
} from 'lucide-react';
import { MealEntry, MealType, FoodItem } from '../types/fitness';
import { COMMON_FOOD_PRESETS } from '../data/defaultData';
import { estimateMealFromText } from '../services/api';

interface MealTrackerProps {
  meals: MealEntry[];
  onAddMeal: (meal: MealEntry) => void;
  onDeleteMeal: (mealId: string) => void;
}

export const MealTracker: React.FC<MealTrackerProps> = ({
  meals,
  onAddMeal,
  onDeleteMeal,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | MealType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [mealName, setMealName] = useState('');
  
  // AI Natural Language input
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiEstimating, setIsAiEstimating] = useState(false);
  const [aiResultTip, setAiResultTip] = useState('');

  // Items currently inside the new meal form
  const [stagedItems, setStagedItems] = useState<FoodItem[]>([]);

  // Manual input fields
  const [manualName, setManualName] = useState('');
  const [manualPortion, setManualPortion] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [manualProtein, setManualProtein] = useState('');
  const [manualCarbs, setManualCarbs] = useState('');
  const [manualFat, setManualFat] = useState('');

  const filteredMeals = activeTab === 'all'
    ? meals
    : meals.filter((m) => m.mealType === activeTab);

  const handleAiEstimate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiEstimating(true);
    setAiResultTip('');

    try {
      const result = await estimateMealFromText(aiPrompt.trim());
      if (result && result.items) {
        const newItems: FoodItem[] = result.items.map((item, idx) => ({
          id: `fi-${Date.now()}-${idx}`,
          name: item.name,
          portion: item.portion || '1 serving',
          calories: Number(item.calories) || 0,
          protein: Number(item.protein) || 0,
          carbs: Number(item.carbs) || 0,
          fat: Number(item.fat) || 0,
          fiber: Number(item.fiber) || 0,
        }));

        setStagedItems((prev) => [...prev, ...newItems]);
        if (!mealName) {
          setMealName(result.mealName || aiPrompt.slice(0, 30));
        }
        if (result.quickTip) {
          setAiResultTip(result.quickTip);
        }
        setAiPrompt('');
      }
    } catch (err: any) {
      alert(err.message || 'Could not estimate meal. Please enter manually.');
    } finally {
      setIsAiEstimating(false);
    }
  };

  const handleAddPreset = (preset: typeof COMMON_FOOD_PRESETS[0]) => {
    const newItem: FoodItem = {
      id: `fi-${Date.now()}`,
      name: preset.name,
      portion: preset.portion,
      calories: preset.calories,
      protein: preset.protein,
      carbs: preset.carbs,
      fat: preset.fat,
      fiber: preset.fiber,
    };
    setStagedItems((prev) => [...prev, newItem]);
    if (!mealName) {
      setMealName(preset.name);
    }
  };

  const handleAddManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    const newItem: FoodItem = {
      id: `fi-${Date.now()}`,
      name: manualName.trim(),
      portion: manualPortion.trim() || '1 serving',
      calories: Number(manualCalories) || 0,
      protein: Number(manualProtein) || 0,
      carbs: Number(manualCarbs) || 0,
      fat: Number(manualFat) || 0,
    };

    setStagedItems((prev) => [...prev, newItem]);
    setManualName('');
    setManualPortion('');
    setManualCalories('');
    setManualProtein('');
    setManualCarbs('');
    setManualFat('');
  };

  const handleRemoveStagedItem = (id: string) => {
    setStagedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveMeal = () => {
    if (stagedItems.length === 0) {
      alert('Please add at least one food item to this meal.');
      return;
    }

    const totalCals = stagedItems.reduce((acc, i) => acc + i.calories, 0);
    const totalP = stagedItems.reduce((acc, i) => acc + i.protein, 0);
    const totalC = stagedItems.reduce((acc, i) => acc + i.carbs, 0);
    const totalF = stagedItems.reduce((acc, i) => acc + i.fat, 0);

    const newMeal: MealEntry = {
      id: `m-${Date.now()}`,
      mealType: selectedMealType,
      name: mealName.trim() || `${selectedMealType.toUpperCase()} Meal`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: stagedItems,
      totalCalories: totalCals,
      totalProtein: totalP,
      totalCarbs: totalC,
      totalFat: totalF,
    };

    onAddMeal(newMeal);
    setIsModalOpen(false);
    setStagedItems([]);
    setMealName('');
    setAiResultTip('');
  };

  return (
    <div className="space-y-5">
      {/* Top Bar: Tabs & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
          {(['all', 'breakfast', 'lunch', 'dinner', 'snack'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setSelectedMealType(activeTab === 'all' ? 'breakfast' : activeTab);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Log Meal</span>
        </button>
      </div>

      {/* Meals List */}
      {filteredMeals.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-10 text-center">
          <UtensilsCrossed className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-300">No meals logged for this category</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">Track your breakfast, lunch, or healthy snacks to fuel your day.</p>
          <button
            onClick={() => {
              setSelectedMealType(activeTab === 'all' ? 'breakfast' : activeTab);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            Add Food Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4.5 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono uppercase font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {meal.mealType}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meal.time}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {meal.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => onDeleteMeal(meal.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete meal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Food items breakdown */}
                <div className="space-y-1.5 my-3">
                  {meal.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-none"
                    >
                      <span className="text-slate-300">
                        {item.name} <span className="text-slate-500 text-[11px]">({item.portion})</span>
                      </span>
                      <span className="font-mono text-slate-400">
                        {item.calories} kcal
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meal Total Macro Badges */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-sm font-black text-white font-mono">
                  {meal.totalCalories} <span className="text-xs font-normal text-slate-400 font-sans">kcal</span>
                </span>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="text-blue-400 font-semibold">{meal.totalProtein}g P</span>
                  <span className="text-amber-400 font-semibold">{meal.totalCarbs}g C</span>
                  <span className="text-rose-400 font-semibold">{meal.totalFat}g F</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Meal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Log Meal & Nutrition</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Meal Type & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Meal Category
                </label>
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value as MealType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Meal Title (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Post-Workout Lunch"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* AI Natural Language Estimator Box */}
            <div className="bg-gradient-to-r from-emerald-950/30 to-teal-950/20 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  AI Instant Meal Estimator (Gemini 3.8 Flash)
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAiEstimate();
                    }
                  }}
                  placeholder="e.g. 2 whole eggs, 1 slice sourdough toast, half avocado and black coffee"
                  className="flex-1 bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAiEstimate}
                  disabled={isAiEstimating || !aiPrompt.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isAiEstimating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Estimate
                </button>
              </div>
              {aiResultTip && (
                <p className="text-[11px] text-emerald-400/90 mt-2 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  {aiResultTip}
                </p>
              )}
            </div>

            {/* Quick Add Presets */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Quick-Add Fitness Staples
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {COMMON_FOOD_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleAddPreset(preset)}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1"
                  >
                    <span>+ {preset.name}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">({preset.calories}kcal)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual item form */}
            <form onSubmit={handleAddManualItem} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Or Add Custom Food Item
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                <input
                  type="text"
                  placeholder="Food item name"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Portion (e.g. 150g)"
                  value={manualPortion}
                  onChange={(e) => setManualPortion(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="number"
                  placeholder="Cals"
                  value={manualCalories}
                  onChange={(e) => setManualCalories(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="number"
                  placeholder="Prot (g)"
                  value={manualProtein}
                  onChange={(e) => setManualProtein(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    placeholder="Carbs"
                    value={manualCarbs}
                    onChange={(e) => setManualCarbs(e.target.value)}
                    className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                  />
                  <input
                    type="number"
                    placeholder="Fat"
                    value={manualFat}
                    onChange={(e) => setManualFat(e.target.value)}
                    className="w-1/2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700"
                >
                  + Add Item
                </button>
              </div>
            </form>

            {/* Staged Items List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Items In This Meal ({stagedItems.length})
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Total: {stagedItems.reduce((acc, i) => acc + i.calories, 0)} kcal • {stagedItems.reduce((acc, i) => acc + i.protein, 0)}g P
                </span>
              </div>

              {stagedItems.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  No food items added yet. Use AI estimator or quick-add staples above.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {stagedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                    >
                      <div>
                        <span className="font-medium text-white">{item.name}</span>{' '}
                        <span className="text-slate-500">({item.portion})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-300 font-semibold">{item.calories} kcal</span>
                        <span className="text-[11px] font-mono text-blue-400">{item.protein}g P</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStagedItem(item.id)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMeal}
                disabled={stagedItems.length === 0}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs disabled:opacity-50 transition-all shadow-md active:scale-95"
              >
                Save Meal to Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
