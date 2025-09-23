import React from "react";
import { useNavigate } from "react-router-dom";

const RecipeCollectionOne = ({ collections }) => {
  const navigate = useNavigate();

  return (
    <div className="my-8">
      <h1 className="text-3xl font-medium lg:text-4xl my-4 uppercase">
        Don't Miss
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {collections?.map((dish) => (
          <div
            onClick={() => navigate(`/collections/${dish?._id}`)}
            key={dish?._id}
            className="relative bg-white border-2 border-[#F3F3F2] overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          >
            <img
              src={dish?.image?.url}
              alt={dish?.name}
              className="w-full h-100 object-cover hover:scale-105 transition-all duration-500"
            />

            <div className="absolute top-60 text-white uppercase bg-gradient-to-t from-black to-transparent px-4 py-2 h-full w-full">
              <p>collection</p>
              <h1 className="text-4xl font-medium two-line-truncate">
                {dish?.name}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeCollectionOne;
