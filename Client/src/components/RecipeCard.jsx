import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { getSingleRecipe, toggleLikeRecipe } from "../api/recipeApi";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

const RecipeCard = ({ id, title, image, date }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  const isLiked = user ? likes.includes(user._id) : false;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getSingleRecipe(id);
        if (data?.likes) setLikes(data.likes);
      } catch (error) {
        console.error("Failed to fetch recipe likes", error);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleToggleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login first");
      return;
    }
    if (loading) return;
    setLoading(true);

    const prevLikes = [...likes];
    if (isLiked) setLikes(likes.filter((uid) => uid !== user._id));
    else setLikes([...likes, user._id]);

    try {
      const data = await toggleLikeRecipe(id);
      if (data?.likes) setLikes(data.likes);
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle like");
      setLikes(prevLikes);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/recipe/${id}`)}
      className="bg-white h-fit min-h-65 w-34 md:w-50 lg:w-60 xl:w-74 flex flex-col overflow-hidden hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-shadow duration-300 cursor-pointer"
    >
      <div className="relative group">
        <div className="w-full h-35 md:h-40 lg:h-44 xl:h-55">
          <img
            src={
              image ||
              "https://imgs.search.brave.com/eJrOBBqXjPdhO8ejCg9Vz4Tkubh4-rLONNGdACLq9vQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbHVz/LnVuc3BsYXNoLmNv/bS9wcmVtaXVtX3Zl/Y3Rvci0xNzEzMzY0/MzkzMDg1LTBmZGRh/MTNlYzdjZD9mbT1q/cGcmcT02MCZ3PTMw/MDAmaXhsaWI9cmIt/NC4xLjA"
            }
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-white/80 px-1 py-1">
          {isLiked ? (
            <IoMdHeart
              onClick={handleToggleLike}
              className={`text-xl text-pink-500 cursor-pointer ${
                loading ? "opacity-50 pointer-events-none" : ""
              }`}
            />
          ) : (
            <IoMdHeartEmpty
              onClick={handleToggleLike}
              className={`text-2xl text-pink-500 cursor-pointer ${
                loading ? "opacity-50 pointer-events-none" : ""
              }`}
            />
          )}
          <span className="text-xs font-semibold text-gray-700 select-none">
            {likes.length}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between flex-1 border-1 border-gray-200">
        <h3 className="text-sm lg:text-lg font-bold text-gray-800 uppercase mb-1">
          {title || "Lorem ipsum dolor sit amet"}
        </h3>

        <p className="text-xs text-gray-500">
          {date
            ? formatDistanceToNow(new Date(date), {
                addSuffix: true,
              })
            : "Just now"}
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;
