import React from "react";
import RecipeCard from "./RecipeCard";
import { getSavedRecipes, removeSaveRecipe } from "../api/recipeApi";
import { useEffect } from "react";
import { useState } from "react";

const SavedRecipies = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    try {
      const data = await getSavedRecipes();
      setRecipes(data?.recipes);
    } catch (error) {
      console.log(error);
    }
  };

  const removeSaved = async (recipeId) => {
    try {
      const data = await removeSaveRecipe(recipeId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="md:sticky top-0 bg-white py-2 text-2xl xl:text-3xl font-bold">
        Saved Recipies
      </h1>
      <div className="flex flex-wrap gap-6">
        {recipes.length > 0 ? (
          recipes?.map((dish) => {
            return (
              <div key={dish?._id}>
                <RecipeCard
                  id={dish?._id}
                  title={dish?.title}
                  image={dish?.image?.url}
                  date={dish?.createdAt}
                />
                <button
                  onClick={() => removeSaved(dish?._id)}
                  className="text-red-600 cursor-pointer uppercase"
                >
                  Remove saved
                </button>
              </div>
            );
          })
        ) : (
          <div className="flex w-full justify-center py-60">
            <p>Empty Saved</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipies;
