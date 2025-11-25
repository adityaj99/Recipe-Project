import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RoundedOneLoader } from "../components/RoundedOneLoader";

import { getSingleRecipe, updateRecipeByAdmin } from "../api/adminApi";
import { getAllCategories, getAllSubCategories } from "../api/recipeApi";

const AdminSingleRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecipe();
    getCategories();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const data = await getSingleRecipe(id);
      setRecipe(data.recipe);
      setFormData({
        status: data.recipe.status,
        category: data.recipe.category?._id || "",
        cuisines: data.recipe.cuisines || [],
        seasons: data.recipe.seasons || [],
        isTrending: data.recipe.isTrending,
        tagName: data.recipe.tagName || "",
        rejectionReason: data.recipe.rejectionReason || "",
      });
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  const getCategories = async () => {
    try {
      const data = await getAllSubCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "cuisines" || name === "seasons") {
      setFormData((prev) => ({
        ...prev,
        [name]: Array.from(e.target.selectedOptions, (opt) => opt.value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateRecipeByAdmin(id, formData);
      toast.success("Recipe status updated successfully.!");
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe status!");
    } finally {
      setLoading(false);
    }
  };

  if (!recipe)
    return (
      <div className="p-6">
        <RoundedOneLoader />
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 underline"
      >
        ← Back
      </button>

      <div>
        <h1 className="text-2xl font-bold mb-4">Recipe Ingredients</h1>

        <div>
          {recipe?.ingredients?.map((item, indx) => {
            return (
              <p
                className="bg-gray-200 mb-2 w-fit p-2 rounded font-bold"
                key={item._id}
              >
                <span className="font-normal">{indx + 1}.</span> {item.quantity}{" "}
                {item.unit} {item.name}
              </p>
            );
          })}
        </div>

        <h1 className="text-2xl font-bold mb-4 mt-10">Recipe Directions</h1>

        <div>
          {recipe?.steps?.map((step, indx) => {
            return (
              <p
                className="bg-gray-200 mb-2 w-fit p-2 rounded font-bold"
                key={step._id}
              >
                <span className="font-normal">{indx + 1}.</span>{" "}
                {step.instruction}
              </p>
            );
          })}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-10">
        Edit Recipe - {recipe.title}
      </h2>

      <div className="space-y-4">
        <div className="bg-gray-200 p-2 rounded">
          <label className="block font-medium">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {formData.status === "rejected" && (
          <div>
            <label className="block font-medium">Rejection Reason</label>
            <textarea
              name="rejectionReason"
              value={formData.rejectionReason}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        )}

        <div>
          <label className="block font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Cuisines</label>
          <select
            name="cuisines"
            multiple
            value={formData.cuisines}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {[
              "Indian",
              "Italian",
              "Mexican",
              "Chinese",
              "Thai",
              "American",
              "Japanese",
              "French",
              "Spanish",
              "German",
              "Other",
            ].map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Seasons</label>
          <select
            name="seasons"
            multiple
            value={formData.seasons}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {["Spring", "Summer", "Fall", "Winter"].map((season) => (
              <option key={season} value={season}>
                {season}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Trending</label>
          <input
            type="checkbox"
            name="isTrending"
            checked={formData.isTrending}
            onChange={handleChange}
            className="ml-2"
          />
        </div>

        <div>
          <label className="block font-medium">Tag Name</label>
          <input
            name="tagName"
            value={formData.tagName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white w-30 h-10 rounded hover:bg-blue-700 cursor-pointer transition-all duration-200 ease-in-out"
        >
          {loading ? <RoundedOneLoader /> : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default AdminSingleRecipePage;
