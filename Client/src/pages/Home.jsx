import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetchCurrentSeasonRecipes();
    fetchFreshRecipes();
    fetchTrendingRecipes();
    fetchQuickRecipes();
    fetchCollections();
  }, []);

  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [freshRecipes, setFreshRecipes] = useState([]);
  const [quickRecipes, setQuickRecipes] = useState([]);
  const [currentSeasonRecipes, setCurrentSeasonRecipes] = useState([]);
  const [currentSeason, setCurrentSeason] = useState("");
  const [emoji, setEmoji] = useState("");
  const [collections, setCollections] = useState([]);

  const fetchFreshRecipes = async () => {
    let limit = 4;
    try {
      const data = await getAllRecipes(limit);
      setFreshRecipes(data?.recipes);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrendingRecipes = async () => {
    try {
      const data = await getTrendingRecipes();
      setTrendingRecipes(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQuickRecipes = async () => {
    try {
      const data = await getQuickRecipes();
      setQuickRecipes(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentSeasonRecipes = async () => {
    try {
      const data = await getRecipesByCurrentSeason();
      setCurrentSeasonRecipes(data?.recipes);
      setCurrentSeason(data?.season);
      setEmoji(data?.emoji);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data?.collections);
    } catch (error) {
      console.error(error);
    }
  };

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
              Explore all time favorite recipies
            </h1>
            <p
              onClick={() => navigate("/recipe/all")}
              className="bg-[#F5CE35] text-lg w-fit rounded-sm px-3 py-3 uppercase tracking-wider cursor-pointer hover:bg-[#F5CE35]/80 transition-all duration-300"
            >
              Explore Recipies
            </p>
          </div>
        </div>

        {/* divider */}
        <div className="h-8 my-6 bg-[#F3F3F2]"></div>

        <div className="my-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-medium lg:text-4xl my-4 uppercase">
              Fresh Recipes
            </h1>
          </div>

          <div className="flex gap-4 flex-wrap">
            {freshRecipes.length > 0 &&
              freshRecipes.slice(0, 4).map((recipe) => {
                return (
                  <RecipeCard
                    id={recipe?._id}
                    title={recipe?.title}
                    image={recipe?.image?.url}
                    date={recipe?.createdAt}
                    key={recipe?._id}
                  />
                );
              })}
            <div></div>
          </div>
        </div>

        {/* divider */}
        <div className="h-8 my-6 bg-[#F3F3F2]"></div>

        {trendingRecipes.length > 0 && (
          <div className="flex">
            <TrendingNow trendingRecipes={trendingRecipes} />
          </div>
        )}

        <div>
          <RecipeCollectionOne collections={collections} />
        </div>

        {/* divider */}
        <div className="h-8 my-6 bg-[#F3F3F2]"></div>

        {quickRecipes && (
          <div>
            <QuickMeal quickRecipes={quickRecipes} />
          </div>
        )}

        {/* divider */}
        <div className="h-8 my-6 bg-[#F3F3F2]"></div>
      </div>

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
              <div className="flex flex-col gap-4 md:w-[80%] xl:w-[40%]">
                {currentSeasonRecipes.slice(1).map((dish) => {
                  return (
                    <div
                      onClick={() => navigate(`/recipe/${dish?._id}`)}
                      key={dish?._id}
                      className="flex gap-4"
                    >
                      <img
                        src={
                          dish?.image?.url ||
                          "https://www.allrecipes.com/thmb/RpgGxMqgp34OLykpDCQonZ93Prw=/144x95/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/6714082-0d7b51f14fd24facb47ccef6d2b0d57c.jpg"
                        }
                        alt=""
                        className="w-25 h-30 lg:w-35"
                      />
                      <p className="font-semibold text-sm lg:text-lg cursor-pointer hover:underline decoration-[#F5CE35]">
                        {dish?.title}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div
                onClick={() =>
                  navigate(`/recipe/${featuredSeasonalRecipe?._id}`)
                }
                className="flex flex-col gap-4"
              >
                <img
                  className="cursor-pointer"
                  src={
                    featuredSeasonalRecipe?.image?.url ||
                    "https://imgs.search.brave.com/eJrOBBqXjPdhO8ejCg9Vz4Tkubh4-rLONNGdACLq9vQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbHVz/LnVuc3BsYXNoLmNv/bS9wcmVtaXVtX3Zl/Y3Rvci0xNzEzMzY0/MzkzMDg1LTBmZGRh/MTNlYzdjZD9mbT1q/cGcmcT02MCZ3PTMw/MDAmaXhsaWI9cmIt/NC4xLjA"
                  }
                  alt=""
                />
                <p className="font-semibold text-3xl cursor-pointer hover:underline decoration-[#F5CE35]">
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
