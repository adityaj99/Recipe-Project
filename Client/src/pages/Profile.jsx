import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Ring2 } from "ldrs/react";
import "ldrs/react/Ring2.css";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

import { FaInstagram, FaFacebook, FaLink, FaTumblr } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { getUserById, toggleFollow } from "../api/userApi";
import Navbar from "../components/Navbar";

import SilverBadge from "../../public/SilverBadge.png";
import GoldBadge from "../../public/GoldBadge.png";
import FlipCard from "../components/FlipCard";
import { getMyRecipes } from "../api/recipeApi";
import RecipeCard from "../components/RecipeCard";
import { RoundedOneLoader } from "../components/RoundedOneLoader";

const Profile = () => {
  const { user: currentUser, updateFollowing } = useAuth();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isSelf, setIsSelf] = useState(true);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const [myRecipes, setMyRecipes] = useState([]);
  const [badges, setBadges] = useState([]);

  const fetchMyRecipes = async () => {
    try {
      const data = await getMyRecipes(userId);
      setMyRecipes(data?.recipes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setIsSelf(user?._id === currentUser?._id);
  }, [user, currentUser]);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    try {
      const data = await getUserById(userId || currentUser?._id);
      setUser(data);
      setBadges(data?.badges);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatLink = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  useEffect(() => {
    if (user && currentUser && !isSelf) {
      const isFollowing = user.followers?.includes(currentUser._id);
      setFollowing(isFollowing);
    }
  }, [user, currentUser, isSelf]);

  const [followLoading, setFollowLoading] = useState(false);

  const handleToggleFollow = async (e) => {
    e.preventDefault();
    if (!user || !currentUser) return;

    setFollowLoading(true);
    try {
      const data = await toggleFollow(userId);
      const isNowFollowing = data?.following;

      // Update user followers locally
      setUser((prevUser) => {
        const updatedFollowers = isNowFollowing
          ? [...(prevUser.followers || []), currentUser._id]
          : (prevUser.followers || []).filter((id) => id !== currentUser._id);
        return {
          ...prevUser,
          followers: updatedFollowers,
        };
      });

      setFollowing(isNowFollowing);
      updateFollowing(userId, isNowFollowing);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update follow status.");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center pt-10">
        <RoundedOneLoader />
      </div>
    );

  return (
    <div>
      <Navbar />
      <div className=" px-4 lg:px-40 py-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-10">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400 shadow-md">
            <img
              src={user?.avatar?.url || "https://avatar.iran.liara.run/public"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="mt-6 md:mt-0 flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {user.name}
              </h2>

              {isSelf ? (
                <button
                  onClick={() => navigate("/account/edit-profile")}
                  className="mt-2 md:mt-0 text-sm bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleToggleFollow(e)}
                  disabled={followLoading}
                  className={`mt-2 md:mt-0 text-sm w-20 flex justify-center items-center h-8 rounded font-semibold ${
                    following
                      ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                      : "bg-yellow-400 hover:bg-yellow-500 text-white"
                  } ${followLoading && "opacity-50 cursor-not-allowed"}`}
                >
                  {followLoading ? (
                    <Ring2
                      size="20"
                      stroke="2"
                      strokeLength="0.25"
                      bgOpacity="0.1"
                      speed="0.8"
                      color="black"
                    />
                  ) : following ? (
                    "Unfollow"
                  ) : (
                    "Follow"
                  )}
                </button>
              )}
            </div>

            {user?.tag !== "" ||
              (user?.tag !== null && (
                <div className="py-4 whitespace-pre-line">
                  <p>{user?.tag}</p>
                </div>
              ))}

            <p className="text-gray-500">{user?.email}</p>

            {(user?.socials?.facebook ||
              user?.socials?.instagram ||
              user?.socials?.x ||
              user?.socials?.tumblr ||
              user?.socials?.personalWebsite) && (
              <div className="flex gap-4 py-4">
                {user.socials.facebook && (
                  <a
                    href={formatLink(user.socials.facebook)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook className="cursor-pointer md:text-xl text-black/80 hover:text-black transition-all duration-300" />
                  </a>
                )}
                {user.socials.instagram && (
                  <a
                    href={formatLink(user.socials.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="cursor-pointer md:text-xl text-black/80 hover:text-black transition-all duration-300" />
                  </a>
                )}
                {user.socials.x && (
                  <a
                    href={formatLink(user.socials.x)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaXTwitter className="cursor-pointer md:text-xl text-black/80 hover:text-black transition-all duration-300" />
                  </a>
                )}
                {user.socials.tumblr && (
                  <a
                    href={formatLink(user.socials.tumblr)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTumblr className="cursor-pointer md:text-xl text-black/80 hover:text-black transition-all duration-300" />
                  </a>
                )}
                {user.socials.personalWebsite && (
                  <a
                    href={formatLink(user.socials.personalWebsite)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLink className="cursor-pointer md:text-xl text-black/80 hover:text-black transition-all duration-300" />
                  </a>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex space-x-6 mt-4 text-gray-700">
              <span>
                <strong className="text-black">
                  {user.recipes?.length || 0}
                </strong>{" "}
                Recipes
              </span>
              <span>
                <strong className="text-black">
                  {user.followers?.length || 0}
                </strong>{" "}
                Followers
              </span>
              <span>
                <strong className="text-black">
                  {user.following?.length || 0}
                </strong>{" "}
                Following
              </span>
            </div>

            <p className="text-sm text-gray-400 mt-2">
              Joined:{" "}
              {user.createdAt
                ? format(new Date(user.createdAt), "dd MMM yyyy")
                : "-"}{" "}
            </p>
          </div>
        </div>

        {/* Badges Section */}
        <div className="flex flex-col md:flex-row gap-4 border-t pt-4">
          {/* Achieved badges */}
          {badges.length > 0 ? (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                🏅 Achieved Badges
              </h2>

              <div className="flex gap-2">
                {badges.map((badge) => {
                  return (
                    <FlipCard name={badge.name} awardedAt={badge.awardedAt} />
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              <p>You can earn badges by creating high-quality recipes.🤩</p>

              <p className="text-gray-700 text-base leading-relaxed">
                🏅 <strong>How to Earn Badges:</strong>
                <br />• <strong>Silver Badge 🥈:</strong> Publish at least{" "}
                <strong>10 approved recipes</strong> with an average rating of{" "}
                <strong>4.5 or higher</strong>.<br />•{" "}
                <strong>Gold Badge 🥇:</strong> Publish at least{" "}
                <strong>25 approved recipes</strong> with an average rating of{" "}
                <strong>4.7 or higher</strong>.<br />
                Keep creating high-quality recipes, engaging with your audience,
                and improving your ratings to unlock these achievements!
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mt-8 border-t" />

        {/* Recipes */}
        <div>
          <h3 className="text-sm font-semibold md:text-xl py-5">
            {isSelf ? "Your Recipes" : `${user.name} Recipes`}
          </h3>
          <div className="w-full flex flex-wrap gap-2">
            {myRecipes.length > 0 ? (
              myRecipes?.map((recipe) => (
                <RecipeCard
                  key={recipe?._id}
                  id={recipe?._id}
                  title={recipe?.title}
                  image={recipe?.image?.url}
                  date={recipe?.createdAt}
                  averageRating={recipe?.averageRating}
                  totalReviews={recipe?.totalReviews}
                />
              ))
            ) : (
              <div>No recipes found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
