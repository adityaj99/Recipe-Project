import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import {
  MdOutlineStarPurple500,
  MdStarBorder,
  MdStarHalf,
} from "react-icons/md";
import {
  IoMdHeartEmpty,
  IoMdHeart,
  IoMdShareAlt,
  IoIosMail,
} from "react-icons/io";
import {
  FaFacebookF,
  FaPinterestP,
  FaBookmark,
  FaRegBookmark,
  FaLink,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NutritionFacts from "../components/NutritionFacts";
import ReviewSection from "../components/ReviewSection";
import IngredientsSection from "../components/IngredientsSection";
import RecipeDirections from "../components/RecipeDirections";
import AllReviews from "../components/AllReviews";
import RecipeCard from "../components/RecipeCard";
import { useNavigate, useParams } from "react-router-dom";
import {
  getNutritionInfo,
  getSimilarRecies,
  getSingleRecipe,
  toggleLikeRecipe,
  toggleSaveRecipe,
} from "../api/recipeApi";
import { useAuth } from "../context/AuthContext";

const Recipe = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const reviewRef = useRef(null);
  const allReviwRef = useRef(null);
  const navigate = useNavigate();

  const [hovered, setHovered] = useState(false);
  const [show, setShow] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);
  const [recipe, setRecipe] = useState({});
  const [nutritionData, setNutritionData] = useState({});
  const [similiarRecipe, setSimilarRecipe] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);

  // Like system states
  const [likesArr, setLikesArr] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const prevLikesRef = useRef(null);
  const prevCountRef = useRef(0);
  const prevIsLikedRef = useRef(false);

  const scrollToReview = () => {
    reviewRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAllReviews = () => {
    allReviwRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchRecipe();
    fetchNutritionInfo();
  }, [id]);

  useEffect(() => {
    if (recipe?.tagName) fetchSimilarRecipes();
  }, [recipe?.tagName]);

  useEffect(() => {
    if (!user) {
      setIsLiked(false);
      return;
    }
    if (Array.isArray(likesArr)) {
      setIsLiked(likesArr.includes(String(user._id)));
    } else {
      if (typeof recipe?.userLiked === "boolean") {
        setIsLiked(recipe.userLiked);
      }
    }
  }, [user, likesArr, recipe?.userLiked]);

  const normalizeLikes = (likes) => {
    if (!Array.isArray(likes)) return null;
    return likes.map((l) =>
      typeof l === "object" && l !== null ? String(l._id || l.id) : String(l)
    );
  };

  const fetchRecipe = async () => {
    try {
      const data = await getSingleRecipe(id);
      setRecipe(data || {});

      const normalized = normalizeLikes(data?.likes);
      if (Array.isArray(normalized)) {
        setLikesArr(normalized);
        setLikesCount(normalized.length);
      } else if (typeof data?.likesCount === "number") {
        setLikesArr(null);
        setLikesCount(data.likesCount);
      } else if (
        Array.isArray(data?.likes) === false &&
        typeof data?.likes === "number"
      ) {
        setLikesArr(null);
        setLikesCount(data.likes);
      } else {
        setLikesArr(normalized); // null
        setLikesCount((data?.likes || []).length || 0);
      }

      if (typeof data?.userLiked === "boolean") {
        setIsLiked(data.userLiked);
      } else if (user && Array.isArray(normalized)) {
        setIsLiked(normalized.includes(String(user._id)));
      }
      setSaved(Boolean(data?.saved));
    } catch (error) {
      console.error("fetchRecipe error:", error);
    }
  };

  const fetchNutritionInfo = async () => {
    try {
      const data = await getNutritionInfo(id);
      setNutritionData(data || {});
    } catch (error) {
      console.error("fetchNutritionInfo error:", error);
    }
  };

  const handleLike = async (e) => {
    e?.stopPropagation?.();
    if (!user) {
      toast.error("Please log in to like a recipe");
      return;
    }
    if (likeLoading) return;

    prevLikesRef.current = likesArr ? [...likesArr] : null;
    prevCountRef.current = likesCount;
    prevIsLikedRef.current = isLiked;

    if (Array.isArray(likesArr)) {
      const currentlyLiked = likesArr.includes(String(user._id));
      if (currentlyLiked) {
        setLikesArr((prev) => prev.filter((uid) => uid !== String(user._id)));
        setLikesCount((c) => Math.max(0, c - 1));
        setIsLiked(false);
      } else {
        setLikesArr((prev) => [...(prev || []), String(user._id)]);
        setLikesCount((c) => c + 1);
        setIsLiked(true);
      }
    } else {
      setIsLiked((prev) => !prev);
      setLikesCount((c) => (isLiked ? Math.max(0, c - 1) : c + 1));
    }

    setLikeLoading(true);

    try {
      const res = await toggleLikeRecipe(id);
      if (res) {
        const normalized = normalizeLikes(res?.likes);
        if (Array.isArray(normalized)) {
          setLikesArr(normalized);
          setLikesCount(normalized.length);
          setIsLiked(user ? normalized.includes(String(user._id)) : false);
        } else if (typeof res?.likesCount === "number") {
          setLikesArr(null);
          setLikesCount(res.likesCount);
          if (typeof res?.liked === "boolean") setIsLiked(res.liked);
        } else if (
          typeof res?.liked === "boolean" &&
          typeof res?.likes === "number"
        ) {
          setLikesArr(null);
          setLikesCount(res.likes);
          setIsLiked(res.liked);
        } else if (typeof res?.liked === "boolean") {
          setIsLiked(res.liked);
        }
        if (res?.message) toast.success(res.message);
      }
    } catch (err) {
      setLikesArr(prevLikesRef.current);
      setLikesCount(prevCountRef.current);
      setIsLiked(prevIsLikedRef.current);
      console.error("toggleLike error:", err);
      toast.error(err?.message || "Failed to toggle like");
    } finally {
      setLikeLoading(false);
    }
  };

  const toggleSave = async () => {
    try {
      const data = await toggleSaveRecipe(id);
      setSaved(Boolean(data?.saved));
      toast.success(`Recipe ${data?.saved ? "saved" : "unsaved"}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to save recipe");
    }
  };

  const fetchSimilarRecipes = async () => {
    try {
      const data = await getSimilarRecies(recipe?.tagName, recipe?._id);
      setSimilarRecipe(data?.similarRecipes || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="my-15 flex flex-col px-4 md:px-40 lg:px-50 gap-8">
        <div className="flex flex-col gap-4 lg:w-[50%]">
          <div>
            <h1 className="text-4xl font-semibold">{recipe?.title}</h1>
          </div>

          {/* Ratings / reviews */}
          <div className="flex gap-2 uppercase">
            <div className="flex items-center border-r-2 pr-2 border-[#F3F3F2]">
              {Array.from({ length: 5 }, (_, index) => {
                const ratingVal = recipe?.averageRating || 0;
                if (ratingVal >= index + 1) {
                  return (
                    <MdOutlineStarPurple500
                      key={index}
                      className="text-[#F5CE35] text-xl"
                    />
                  );
                } else if (ratingVal > index && ratingVal < index + 1) {
                  return (
                    <MdStarHalf
                      key={index}
                      className="text-[#F5CE35] text-xl"
                    />
                  );
                } else {
                  return (
                    <MdStarBorder
                      key={index}
                      className="text-[#F5CE35] text-xl"
                    />
                  );
                }
              })}
              <p className="text-sm ml-2">
                {recipe?.averageRating?.toFixed?.(1)}
              </p>
            </div>
            <div>
              <p
                onClick={scrollToAllReviews}
                className="font-semibold hover:underline decoration-0 cursor-pointer"
              >
                {recipe?.totalReviews} reviews
              </p>
            </div>
          </div>

          <div>
            <p>{recipe?.description}</p>
          </div>

          <div className="flex flex-col gap-2">
            <p>
              By{" "}
              <span className="font-bold">
                <span
                  onClick={() => navigate(`/${recipe?.author?._id}`)}
                  className="cursor-pointer hover:underline decoration-0"
                >
                  {recipe?.author?.name}
                </span>
              </span>
            </p>
            <p className="text-gray-500">
              Published on{" "}
              {recipe?.createdAt &&
                format(new Date(recipe?.createdAt), "dd MMM yyyy")}
            </p>
          </div>

          {/* Buttons row */}
          <div className="flex text-xs md:text-sm lg:w-fit bg-[#F5F7EB] rounded-sm font-bold overflow-y-auto [&::-webkit-scrollbar]:hidden uppercase">
            <div
              onClick={toggleSave}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="flex items-center gap-2 bg-[#F5CE35] px-3 py-3 cursor-pointer hover:bg-[#F5CE35]/70"
            >
              <p>Save</p>
              {hovered || saved ? (
                <FaBookmark className="text-red-500" />
              ) : (
                <FaRegBookmark />
              )}
            </div>

            <div
              onClick={scrollToReview}
              className="flex items-center gap-2 px-3 py-3 border-r-1 border-white cursor-pointer"
            >
              <p>Rate</p>
              <MdOutlineStarPurple500 />
            </div>

            <div
              onClick={handleLike}
              className="flex items-center gap-1 px-3 py-3 border-r-1 border-white cursor-pointer"
              role="button"
              aria-pressed={isLiked}
            >
              <p className="flex gap-1">
                <span>{likesCount} </span>
                {likesCount === 1 ? "Like" : "Likes"}
              </p>
              {isLiked ? (
                <IoMdHeart
                  className={`text-red-500 ${likeLoading ? "opacity-50" : ""}`}
                />
              ) : (
                <IoMdHeartEmpty
                  className={`${likeLoading ? "opacity-50" : ""}`}
                />
              )}
            </div>

            {!shareClicked ? (
              <div
                onClick={() => setShareClicked(true)}
                className="flex items-center gap-2 px-3 py-3 cursor-pointer hover:text-black transition"
              >
                <p>Share</p>
                <IoMdShareAlt />
              </div>
            ) : (
              <div className="share-slide flex items-center">
                {/* Facebook */}
                <div
                  className="social-icon cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`,
                      "_blank"
                    )
                  }
                >
                  <FaFacebookF />
                </div>

                {/* Twitter */}
                <div
                  className="social-icon cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                        window.location.href
                      )}&text=${encodeURIComponent(
                        "Check out this amazing recipe!"
                      )}`,
                      "_blank"
                    )
                  }
                >
                  <FaXTwitter />
                </div>

                {/* Pinterest */}
                <div
                  className="social-icon cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                        window.location.href
                      )}&description=${encodeURIComponent(
                        "Check out this recipe!"
                      )}`,
                      "_blank"
                    )
                  }
                >
                  <FaPinterestP />
                </div>

                {/* Email */}
                <div
                  className="social-icon cursor-pointer"
                  onClick={() =>
                    (window.location.href = `mailto:?subject=${encodeURIComponent(
                      "Check out this recipe!"
                    )}&body=${encodeURIComponent(window.location.href)}`)
                  }
                >
                  <IoIosMail />
                </div>

                {/* Copy Link */}
                <div
                  className="social-icon cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }}
                >
                  <FaLink />
                </div>
              </div>
            )}
          </div>

          {/* IMAGE */}
          <div>
            <img
              src={
                recipe?.image?.url ||
                "https://imgs.search.brave.com/eJrOBBqXjPdhO8ejCg9Vz4Tkubh4-rLONNGdACLq9vQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbHVz/LnVuc3BsYXNoLmNv/bS9wcmVtaXVtX3Zl/Y3Rvci0xNzEzMzY0/MzkzMDg1LTBmZGRh/MTNlYzdjZD9mbT1q/cGcmcT02MCZ3PTMw/MDAmaXhsaWI9cmIt/NC4xLjA"
              }
              alt={recipe?.title}
            />
          </div>

          {/* TIMES */}
          <div className="printable-content border border-gray-300 border-t-10 border-t-[#F5CE35] flex gap-8 lg:gap-10 p-4 lg:px-8 flex-wrap rounded-md">
            <div className="flex flex-col">
              <p className="font-bold text-xl lg:text-xl">Prep Time:</p>
              <p>{recipe?.prepTime} min</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-xl lg:text-xl">Cook Time:</p>
              <p>{recipe?.cookingTime} min</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-xl lg:text-xl">Total Time:</p>
              <p>{recipe?.totalTime} min</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-xl lg:text-xl">Servings:</p>
              <p>{recipe?.servings}</p>
            </div>
          </div>

          <IngredientsSection
            ingredients={recipe?.ingredients}
            servings={recipe?.servings}
          />
          <RecipeDirections steps={recipe?.steps} notes={recipe?.notes} />

          {Object.keys(nutritionData).length > 0 && (
            <p
              className="cursor-pointer lg:text-xl underline decoration-[#F5CE35] hover:decoration-2"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide Nutrition Information" : "Nutrition Information"}
            </p>
          )}

          <div
            className="overflow-hidden transition-all duration-500 ease-in-out"
            style={{
              maxHeight: show ? "1000px" : "0px",
              opacity: show ? 1 : 0,
            }}
          >
            {nutritionData && <NutritionFacts data={nutritionData} />}
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <h2 className="text-3xl font-bold mb-4">
              Reviews ({recipe?.totalReviews})
            </h2>
            <div className="w-full p-2 lg:p-6 bg-[#F5F7EB]">
              <ReviewSection
                ref={reviewRef}
                recipeName={recipe?.title}
                averageRating={recipe?.averageRating}
                totalReviews={recipe?.totalReviews}
                recipeId={recipe?._id}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <AllReviews
              ref={allReviwRef}
              user={user}
              comment={comment}
              rating={rating}
              recipeId={recipe?._id}
              authorId={recipe?.author?._id}
            />
          </div>
        </div>
      </div>

      {/* You might also like */}
      {similiarRecipe?.length > 0 && (
        <div className="px-4 lg:px-40">
          <h1 className="text-3xl font-bold">You'll also like</h1>
          <div className="mt-8 flex flex-wrap gap-4">
            {similiarRecipe?.map((dish) => (
              <RecipeCard
                id={dish?._id}
                title={dish?.title}
                image={dish?.image}
                likes={dish?.likes}
                key={dish?._id}
                date={dish?.createdAt}
              />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Recipe;
