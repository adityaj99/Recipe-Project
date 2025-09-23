import { useState } from "react";
import {
  MdOutlineStarPurple500,
  MdStarHalf,
  MdStarBorder,
} from "react-icons/md";
import { addComment } from "../api/commentApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"

const ReviewSection = ({
  ref,
  recipeName,
  averageRating,
  totalReviews,
  recipeId,
  rating,
  setRating,
  comment,
  setComment,
}) => {

  const navigate = useNavigate();

  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewStats, setReviewStats] = useState({
    5: 60,
    4: 25,
    3: 10,
    2: 3,
    1: 2,
  });
  const [error, setError] = useState(false);

  const { user } = useAuth();

  const handleSubmit = async () => {
    if (user === null) {
      setError(true);
      return;
    }

    try {
      const data = await addComment({
        recipeId,
        rating,
        text: comment,
        userId: user?._id
      });
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div ref={ref} className="flex bg-white shadow p-4 flex-col w-full gap-6">
      <h1 className="text-xl font-bold">{recipeName}</h1>
      {/* Rating Stars */}
      <div className="flex flex-col">
        <p className="font-bold">My Rating</p>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <MdOutlineStarPurple500
              key={star}
              size={28}
              className={`cursor-pointer transition ${
                star <= (hoveredStar || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>

      {/* Review Textarea */}
      <div className="flex flex-col gap-2">
        <p className="font-bold">My Review</p>
        <textarea
          placeholder="What did you think about this recipe? Did you make it?"
          className="border p-3 w-full h-32 focus:outline-none resize-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Submit / Cancel Buttons */}
        <div className="flex justify-end gap-4 text-sm">
          <button
            className="bg-[#F5CE35] font-semibold py-1 px-3  hover:brightness-90 transition uppercase"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className=" px-3 py-1 text-gray-400 hover:bg-gray-100 transition uppercase"
            onClick={() => {
              setRating(0);
              setComment("");
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      <div>
        {error && (
          <p className="text-red-500">
            Please login to add comment{" "}
            <span
              onClick={() => navigate(`/login`)}
              className=" bg-[#F5CE35] text-black font-semibold hover:brightness-90 transition uppercase py-1 px-2 cursor-pointer"
            >
              {" "}
              go to login
            </span>
          </p>
        )}
      </div>

      <div className="border-t flex flex-col gap-4 border-[#F3F3F2] pt-4">
        <div className="flex items-center mx-auto gap-3">
          <span className="text-yellow-400 flex items-center">
            {Array.from({ length: 5 }, (_, index) => {
              const rating = averageRating || 0;
              if (rating >= index + 1) {
                return (
                  <MdOutlineStarPurple500
                    key={index}
                    className="text-[#F5CE35] text-xl"
                  />
                );
              } else if (rating > index && rating < index + 1) {
                return (
                  <MdStarHalf key={index} className="text-[#F5CE35] text-xl" />
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
          </span>
          <span className="text-black border-r-2 border-[#F3F3F2] pr-2">
            {averageRating} out of 5
          </span>
          <span className="text-gray-500 font-normal text-base">
            {totalReviews} reviews
          </span>
        </div>

      </div>
    </div>
  );
};

export default ReviewSection;
