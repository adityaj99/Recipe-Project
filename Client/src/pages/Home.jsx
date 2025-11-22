import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import TrendingNow from "../components/TrendingNow";
import QuickMeal from "../components/QuickMeal";
import RecipeCollectionOne from "../components/RecipeCollectionOne";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";

import {
  getAllRecipes,
  getCollections,
  getQuickRecipes,
  getRecipesByCurrentSeason,
  getTrendingRecipes,
} from "../api/recipeApi";

const Home = () => {
  const navigate = useNavigate();

  const [freshRecipes, setFreshRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [quickRecipes, setQuickRecipes] = useState([]);
  const [currentSeasonRecipes, setCurrentSeasonRecipes] = useState([]);
  const [currentSeason, setCurrentSeason] = useState("");
  const [emoji, setEmoji] = useState("");
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fresh, trending, quick, season, collectionsData] =
          await Promise.all([
            getAllRecipes(4),
            getTrendingRecipes(),
            getQuickRecipes(),
            getRecipesByCurrentSeason(),
            getCollections(),
          ]);

        // Set all states in one place — faster & fewer re-renders
        setFreshRecipes(fresh?.recipes || []);
        setTrendingRecipes(trending || []);
        setQuickRecipes(quick || []);
        setCurrentSeasonRecipes(season?.recipes || []);
        setCurrentSeason(season?.season || "");
        setEmoji(season?.emoji || "");
        setCollections(collectionsData?.collections || []);
      } catch (err) {
        console.error("Home page data load failed:", err);
      }
    };

    loadData();
  }, []);

  const featuredSeasonalRecipe = currentSeasonRecipes?.[0];

  return (
    <div>
      <Navbar />

      <div className="flex flex-col p-4 lg:px-40">
        {/* Hero Section */}
        <div className="relative w-full flex flex-col justify-center">
          <img
            src="https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_1280,ar_16:9/v1/img/recipes/30/08/1/uaSpHBwtSIuQpcHZKQeu_0S9A0050.jpg"
            alt=""
          />
          <div className="md:absolute md:w-60 lg:w-80 md:left-20 lg:left-50 md:bottom-20 lg:bottom-60">
            <h1 className="text-3xl font-medium lg:text-5xl my-2 uppercase">
              Explore all time favorite recipes
            </h1>
            <p
              onClick={() => navigate("/recipe/all")}
              className="bg-[#F5CE35] text-lg w-fit rounded-sm px-3 py-3 uppercase tracking-wider cursor-pointer hover:bg-[#F5CE35]/80 transition-all duration-300"
            >
              Explore Recipes
            </p>
          </div>
        </div>

        {/* divider */}
        <div className="h-8 my-6 bg-[#F3F3F2]"></div>

        {/* Fresh Recipes */}
        <div className="my-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-medium lg:text-4xl my-4 uppercase">
              Fresh Recipes
            </h1>
          </div>

          <div className="flex gap-4 flex-wrap">
            {freshRecipes.length > 0 &&
              freshRecipes.map((recipe) => (
                <RecipeCard
                  id={recipe?._id}
                  title={recipe?.title}
                  image={recipe?.image?.url}
                  date={recipe?.createdAt}
                  key={recipe?._id}
                />
              ))}
          </div>
        </div>

        {/* divider */}
        <div className="h-8 my-6 bg-[#F3F3F2]"></div>

        {trendingRecipes.length > 0 && (
          <TrendingNow trendingRecipes={trendingRecipes} />
        )}

        <RecipeCollectionOne collections={collections} />

        {/* divider */}
        <div className="h-8 my-6 bg-[#F3F3F2]"></div>

        {quickRecipes.length > 0 && <QuickMeal quickRecipes={quickRecipes} />}

        {/* divider */}
        <div className="h-8 my-6 bg-[#F3F3F2]"></div>
      </div>

      {/* Seasonal Recipes Section */}
      <div>
        {currentSeasonRecipes?.length > 0 && (
          <div className="mt-8 bg-[#F5F7EB] px-40 py-4">
            <h1 className="text-3xl text-center font-medium lg:text-4xl my-4 uppercase">
              <span className="underline decoration-4 decoration-[#F5CE35]">
                Welcome, {currentSeason}
              </span>{" "}
              <span className="no-underline">{emoji}</span>
            </h1>

            <div className="flex flex-col-reverse md:flex-row gap-10 p-4">
              {/* Left List */}
              <div className="flex flex-col gap-4 md:w-[80%] xl:w-[40%]">
                {currentSeasonRecipes.slice(1).map((dish) => (
                  <div
                    onClick={() => navigate(`/recipe/${dish?._id}`)}
                    key={dish?._id}
                    className="flex gap-4 cursor-pointer"
                  >
                    <img
                      src={
                        dish?.image?.url || "https://via.placeholder.com/150"
                      }
                      alt=""
                      className="w-25 h-30 lg:w-35"
                    />
                    <p className="font-semibold text-sm lg:text-lg hover:underline decoration-[#F5CE35]">
                      {dish?.title}
                    </p>
                  </div>
                ))}
              </div>

              {/* Featured image */}
              <div
                onClick={() =>
                  navigate(`/recipe/${featuredSeasonalRecipe?._id}`)
                }
                className="flex flex-col gap-4 cursor-pointer"
              >
                <img
                  src={
                    featuredSeasonalRecipe?.image?.url ||
                    "https://via.placeholder.com/300"
                  }
                  alt=""
                />
                <p className="font-semibold text-3xl hover:underline decoration-[#F5CE35]">
                  {featuredSeasonalRecipe?.title}
                </p>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Home;
