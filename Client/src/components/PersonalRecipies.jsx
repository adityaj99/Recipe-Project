import { useEffect } from "react";
import { getMyRecipes } from "../api/recipeApi";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "./RecipeCard";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PersonalRecipies = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const [myRecipes, setMyRecipes] = useState([]);

  const fetchMyRecipes = async () => {
    try {
      const data = await getMyRecipes(user?._id);
      setMyRecipes(data?.recipes);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="md:sticky top-0 bg-white py-2 text-2xl xl:text-3xl font-bold z-10">
        Personal Recipies
      </h1>
      <div className="flex flex-wrap gap-4">
        {myRecipes?.map((dish) => {
          return (
            <div key={dish?._id} className="flex flex-col gap-1 items-end">
              <RecipeCard
                key={dish?._id}
                id={dish?._id}
                title={dish?.title}
                image={dish?.image?.url}
                date={dish?.createdAt}
                averageRating={dish?.averageRating}
                totalReviews={dish?.totalReviews}
              />
              <p
                onClick={() => navigate(`/recipe/${dish?._id}/add-nutrition`)}
                className="text-gray-600 text-sm italic cursor-pointer hover:underline"
              >
                Add Nutrition Details
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonalRecipies;
