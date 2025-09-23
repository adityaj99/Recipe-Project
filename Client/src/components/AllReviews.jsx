import { useEffect, useState } from "react";
import { format } from "date-fns";

import userImg from "../../public/user.png";

import { FaStar } from "react-icons/fa";
import { MdThumbUp } from "react-icons/md";
import { getRecipeComments, helpfulComment } from "../api/commentApi";
import Pagination from "./Pagination";

export default function AllReviews({ recipeId, ref, authorId }) {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState({});

  const fetchAllReviews = async () => {
    try {
      const data = await getRecipeComments(recipeId, currentPage);
      setReviews(data?.comments || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, [recipeId, currentPage]);

  const handleHelpfulClick = async (reviewId) => {
    try {
      const data = await helpfulComment(reviewId);
      setCount((prev) => ({
        ...prev,
        [reviewId]: data.helpfulCount,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div ref={ref} className="space-y-2">
      {reviews.length > 0 && <h1 className="text-3xl font-bold">Reviews</h1>}
      {reviews?.map((review) => (
        <div
          key={review._id}
          className="bg-white w-[99%] h-[99%] p-4 border border-gray-200"
        >
          {/* Top Row */}
          <div className="flex items-center gap-4 mb-2">
            <img
              src={review?.user?.avatar?.url || userImg}
              alt={review?.user?.name}
              className="w-10 h-10 rounded-full object-cover border"
            />

            <div className="flex flex-col">
              <span className="font-bold text-sm flex items-center gap-2">
                {review.user.name}{" "}
                {authorId === review.user?._id && (
                  <span className="text-xs font-light bg-amber-300 py-[1.5px] px-1 rounded-sm">
                    Author
                  </span>
                )}
              </span>

              <div className="flex items-center text-sm text-gray-500 gap-2">
                <div className="flex text-[#F5CE35]">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < review.rating ? "text-[#F5CE35]" : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  • {format(new Date(review.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>

          {/* Comment */}
          <p className="mb-3 text-sm">{review.text}</p>

          {/* Helpful Button */}
          <button
            onClick={() => handleHelpfulClick(review._id)}
            // disabled={voted.includes(review._id)}
            className={`text-sm flex gap-2 items-center rounded px-2 py-1 transition `}
          >
            <MdThumbUp className="text-[#F5CE35] text-lg" />
            Helpful?{" "}
            <span className="font-medium text-gray-600">
              {/* ({review?.helpful?.length}) */}(
              {count[review?._id] ?? review.helpful.length})
            </span>
          </button>
        </div>
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
