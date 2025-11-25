import { useEffect, useState, lazy, Suspense, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";
import {
  getAllRecipes,
  getCollections,
  getPopularRecipes,
  getQuickRecipes,
  getRecipesByCurrentSeason,
  getTrendingRecipes,
} from "../api/recipeApi";

// Lazy-loaded sections
const TrendingNow = lazy(() => import("../components/TrendingNow"));
const QuickMeal = lazy(() => import("../components/QuickMeal"));
const RecipeCollectionOne = lazy(() =>
  import("../components/RecipeCollectionOne")
);
const PopularRecipes = lazy(() => import("../components/PopularRecipes"));

const Home = () => {
  const navigate = useNavigate();

  const [freshRecipes, setFreshRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [quickRecipes, setQuickRecipes] = useState([]);
  const [currentSeasonRecipes, setCurrentSeasonRecipes] = useState([]);
  const [currentSeason, setCurrentSeason] = useState("");
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [emoji, setEmoji] = useState("");
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Seasonal featured recipe — memoized
  const featuredSeasonalRecipe = useMemo(
    () => currentSeasonRecipes?.[0],
    [currentSeasonRecipes]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [fresh, trending, quick, season, collectionsData, popular] =
          await Promise.all([
            getAllRecipes({ limit: 4 }),
            getTrendingRecipes(),
            getQuickRecipes(),
            getRecipesByCurrentSeason(),
            getCollections(),
            getPopularRecipes(),
          ]);

        setFreshRecipes(fresh?.recipes || []);
        setTrendingRecipes(trending || []);
        setQuickRecipes(quick || []);
        setCurrentSeasonRecipes(season?.recipes || []);
        setCurrentSeason(season?.season || "");
        setEmoji(season?.emoji || "");
        setCollections(collectionsData?.collections || []);
        setPopularRecipes(popular?.recipes || []);
      } catch (err) {
        console.error("Home page data load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <Navbar />

      <div className="flex flex-col p-4 lg:px-20 xl:px-40">
        {/* Hero Section */}
        <div className="relative w-full flex flex-col justify-center">
          <div className="absolute hidden md:block w-full h-full bg-gradient-to-r from-black/70 to-transparent"></div>

          <img
            src="https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_1280,ar_16:9/v1/img/recipes/11/77/76/nMyPCs6fQTKKu71lvP7y_0S9A6071.jpg"
            alt=""
          />
          <div className="md:absolute md:w-60 lg:w-80 md:left-20 lg:left-50 md:bottom-20 lg:bottom-60">
            <h1 className="text-3xl font-medium lg:text-5xl my-2 text-white uppercase">
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

        {/* Divider */}
        <div className="h-8 my-6 bg-[#F3F3F2]"></div>

        {/* Fresh Recipes */}
        <SectionWrapper title="Fresh Recipes">
          <div className="flex gap-2 flex-wrap">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-34 min-h-65 md:w-60 xl:w-73 bg-[#F3F3F2] animate-pulse rounded"
                  ></div>
                ))
              : freshRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe?._id}
                    id={recipe?._id}
                    title={recipe?.title}
                    image={recipe?.image?.url}
                    date={recipe?.createdAt}
                    averageRating={recipe?.averageRating}
                    totalReviews={recipe?.totalReviews}
                  />
                ))}
          </div>
        </SectionWrapper>

        {/* Divider */}
        <div className="h-8 my-6 bg-[#F3F3F2]"></div>

        {/* Lazy Loaded Sections */}
        <Suspense fallback={<SkeletonSection count={4} />}>
          {trendingRecipes.length > 0 && (
            <TrendingNow trendingRecipes={trendingRecipes} loading={loading} />
          )}
        </Suspense>

        {trendingRecipes.length > 0 && (
          <div className="h-8 my-6 bg-[#F3F3F2]"></div>
        )}

        <Suspense fallback={<SkeletonSection count={3} />}>
          {collections.length > 0 && (
            <RecipeCollectionOne collections={collections} />
          )}
        </Suspense>

        <Suspense fallback={<SkeletonSection count={3} />}>
          {quickRecipes.length > 0 && (
            <QuickMeal quickRecipes={quickRecipes} loading={loading} />
          )}
        </Suspense>

        {quickRecipes.length > 0 && (
          <div className="h-8 my-6 bg-[#F3F3F2]"></div>
        )}

        <Suspense fallback={<SkeletonSection count={3} />}>
          {popularRecipes.length > 0 && (
            <PopularRecipes popularRecipes={popularRecipes} loading={loading} />
          )}
        </Suspense>
      </div>

      {/* Seasonal Recipes Section */}
      {currentSeasonRecipes?.length > 0 && (
        <div className="mt-8 bg-[#F5F7EB] lg:px-40 py-4">
          <h1 className="text-3xl text-center font-medium lg:text-4xl my-4 uppercase">
            <span className="underline decoration-4 decoration-[#F5CE35]">
              Welcome, {currentSeason}
            </span>{" "}
            <span>{emoji}</span>
          </h1>

          <div className="flex flex-col-reverse md:flex-row gap-10 p-4">
            {/* List */}
            <div className="flex flex-col gap-4 md:w-[80%] xl:w-[40%]">
              {currentSeasonRecipes.slice(1).map((dish) => (
                <div
                  key={dish?._id}
                  onClick={() => navigate(`/recipe/${dish?._id}`)}
                  className="flex gap-4 cursor-pointer"
                >
                  <img
                    src={dish?.image?.url}
                    alt=""
                    className="w-25 h-20 md:w-20 md:h-10 lg:h-22 lg:w-35"
                  />
                  <p className="font-semibold text-sm lg:text-lg hover:underline decoration-[#F5CE35]">
                    {dish?.title}
                  </p>
                </div>
              ))}
            </div>

            {/* Featured */}
            <div
              onClick={() => navigate(`/recipe/${featuredSeasonalRecipe?._id}`)}
              className="flex flex-col gap-4 cursor-pointer"
            >
              <img src={featuredSeasonalRecipe?.image?.url} alt="" />
              <p className="font-semibold text-3xl hover:underline decoration-[#F5CE35]">
                {featuredSeasonalRecipe?.title}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Home;

const SectionWrapper = ({ title, children }) => (
  <div className="my-8">
    <h1 className="text-3xl font-medium lg:text-4xl my-4 uppercase">{title}</h1>
    {children}
  </div>
);

const SkeletonSection = ({ count }) => (
  <div className="flex gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="w-34 h-55 md:w-60 md:h-65 lg:w-74 lg:h-70 bg-[#F3F3F2] animate-pulse rounded"
      ></div>
    ))}
  </div>
);
