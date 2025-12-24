
import React, { useState } from 'react';
import { getRecipe } from '../services/gemini';
import { Recipe } from '../types';

const RecipeHub: React.FC = () => {
  const [dish, setDish] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const featuredDishes = ["Doro Wat", "Injera", "Kitfo", "Misir Wat", "Shiro", "Beyaynetu"];

  const handleFetchRecipe = async (d?: string) => {
    const dishName = d || dish;
    if (!dishName.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const data = await getRecipe(dishName);
      setRecipe(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8 h-full">
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-5 md:p-6 rounded-2xl">
          <h2 className="text-xl md:text-2xl font-serif text-amber-800 mb-4 md:mb-6 font-bold">Abyssinian Flavors</h2>
          <p className="text-stone-800 text-xs md:text-sm mb-4 md:mb-6 font-medium leading-relaxed">Ethiopian cuisine is a communal experience. Discover the secrets of our traditional spices and fermentation.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
            {featuredDishes.map((d, i) => {
              const colors = [
                'bg-red-50 text-red-800 border-red-200 hover:bg-red-100',
                'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
                'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
                'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100'
              ];
              return (
                <button
                  key={d}
                  onClick={() => handleFetchRecipe(d)}
                  className={`text-[10px] md:text-sm py-2.5 md:py-3 rounded-xl border transition-all font-bold ${colors[i % colors.length]}`}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <div className="space-y-2 md:space-y-3">
            <input
              type="text"
              value={dish}
              onChange={(e) => setDish(e.target.value)}
              placeholder="Other dishes..."
              className="w-full bg-white border border-stone-300 rounded-xl px-3 md:px-4 py-2.5 md:py-3 focus:outline-none focus:ring-2 focus:ring-amber-600/50 text-xs md:text-sm text-stone-950 font-medium placeholder:text-stone-400"
            />
            <button
              onClick={() => handleFetchRecipe()}
              className="w-full bg-red-700 hover:bg-red-800 text-white py-2.5 md:py-3 rounded-xl font-bold transition-all shadow-lg text-sm"
            >
              Get Recipe
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 glass-card rounded-2xl p-5 md:p-8 overflow-y-auto relative min-h-[400px] md:min-h-[500px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <div className="text-center p-4">
              <div className="w-10 md:w-12 h-10 md:h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-stone-700 font-bold text-sm md:text-base">Harvesting Berbere and Garlic...</p>
            </div>
          </div>
        ) : recipe ? (
          <div className="space-y-6 md:space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-2xl md:text-4xl font-serif text-amber-800 mb-2 font-bold">{recipe.name}</h1>
              <div className="h-1 w-16 md:w-24 ethiopian-gradient rounded-full"></div>
            </div>

            <section>
              <h3 className="text-base md:text-xl font-serif text-stone-900 mb-2 md:mb-3 italic font-bold">Historical Context</h3>
              <p className="text-stone-800 leading-relaxed text-xs md:text-sm font-medium">{recipe.history}</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <section>
                <h3 className="text-sm md:text-lg font-bold text-emerald-800 mb-3 md:mb-4 uppercase tracking-wider">Ingredients</h3>
                <ul className="space-y-2 md:space-y-3">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start space-x-2 md:space-x-3 text-xs md:text-sm text-stone-900 font-medium">
                      <span className="text-amber-700 mt-1 font-bold">•</span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="text-sm md:text-lg font-bold text-yellow-700 mb-3 md:mb-4 uppercase tracking-wider">Method</h3>
                <ol className="space-y-3 md:space-y-4">
                  {recipe.instructions.map((step, i) => (
                    <li key={i} className="flex space-x-3 md:space-x-4 text-xs md:text-sm text-stone-900 font-medium">
                      <span className="font-bold text-amber-700">{i + 1}.</span>
                      <p className="leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-60 text-center p-8">
            <svg className="w-16 md:w-24 h-16 md:h-24 text-stone-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-stone-700 font-serif font-bold text-sm md:text-base">Select a dish to begin the culinary voyage.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeHub;
