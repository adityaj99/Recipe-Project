import React from "react";
import { getCollectionById } from "../api/recipeApi";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteCollection } from "../api/adminApi";
import { toast } from "react-toastify";

const AdminSingleCollectionPage = () => {

  const navigate = useNavigate();

  const { collectionId } = useParams();

  const [collection, setCollection] = useState({
    title: "",
    image: "",
    description: "",
    recipes: [],
  });

  useEffect(() => {
    getCollection();
  }, [collectionId]);

  const getCollection = async () => {
    try {
      const data = await getCollectionById(collectionId);
      setCollection(data?.collection);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteColl = async () => {
    try {
      const data = await deleteCollection(collectionId);
      navigate("/admin/collections");
      toast.success("Collection deleted!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col py-5">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 w-fit text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      {/* Collection Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
        {/* Vertical Image */}
        <img
          src={collection.image?.url}
          alt={collection?.name}
          className="w-full md:w-100 max-h-60 object-contain rounded"
        />

        {/* Title & Description */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{collection?.name}</h1>
          <p className="text-lg text-gray-600 mt-3 max-w-2xl">
            {collection?.description}
          </p>

          <div className="relative flex gap-2">
            <button
              onClick={() =>
                navigate(`/admin/collections/${collectionId}/edit`)
              }
              className="mt-4 px-4 py-2 text-sm bg-[#49749c] text-white rounded hover:bg-[#3c5e7c] transition"
            >
              Edit Collection
            </button>
            <button
              onClick={deleteColl}
              className="mt-4 px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-400 transition"
            >
              Delete Collection
            </button>
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Recipes in this Collection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collection?.recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={recipe?.image?.url}
                alt={recipe?.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{recipe?.title}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {recipe?.description}
                </p>
                <button
                  onClick={() => navigate(`/admin/recipe/${recipe._id}`)}
                  className="mt-4 w-full px-4 py-2 bg-[#e7edf4] text-[#0d151c] text-sm font-medium rounded-lg hover:bg-[#d7e0ea] transition"
                >
                  View Recipe
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSingleCollectionPage;
