
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-1 space-y-6">
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-2xl font-serif text-amber-400 mb-6">Abyssinian Flavors</h2>
          <p className="text-stone-400 text-sm mb-6">Ethiopian cuisine is a communal experience. Discover the secrets of our traditional spices and fermentation.</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {featuredDishes.map((d) => (
              <button
                key={d}
                onClick={() => handleFetchRecipe(d)}
                className="text-sm bg-stone-800 hover:bg-stone-700 text-stone-200 py-3 rounded-xl border border-stone-700 transition-all font-medium"
              >
                {d}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={dish}
              onChange={(e) => setDish(e.target.value)}
              placeholder="Other dishes..."
              className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm"
            />
            <button
              onClick={() => handleFetchRecipe()}
              className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all shadow-lg"
            >
              Get Recipe
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 glass-card rounded-2xl p-8 overflow-y-auto relative min-h-[500px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-center">
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-stone-400">Harvesting Berbere and Garlic...</p>
             </div>
          </div>
        ) : recipe ? (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h1 className="text-4xl font-serif text-amber-400 mb-2">{recipe.name}</h1>
              <div className="h-1 w-24 ethiopian-gradient rounded-full"></div>
            </div>
            
            <section>
              <h3 className="text-xl font-serif text-stone-200 mb-3 italic">Historical Context</h3>
              <p className="text-stone-400 leading-relaxed text-sm">{recipe.history}</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section>
                <h3 className="text-lg font-bold text-emerald-400 mb-4 uppercase tracking-wider">Ingredients</h3>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm text-stone-300">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="text-lg font-bold text-yellow-400 mb-4 uppercase tracking-wider">Method</h3>
                <ol className="space-y-4">
                  {recipe.instructions.map((step, i) => (
                    <li key={i} className="flex space-x-4 text-sm text-stone-300">
                      <span className="font-bold text-amber-500">{i + 1}.</span>
                      <p className="leading-relaxed">{step}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-40">
            <svg className="w-24 h-24 text-stone-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-stone-500 font-serif">Select a dish to begin the culinary voyage.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeHub;
