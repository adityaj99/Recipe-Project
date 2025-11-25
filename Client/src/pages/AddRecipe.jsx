import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import { addRecipe, getAllCategories } from "../api/recipeApi";
import { RoundedOneLoader } from "../components/RoundedOneLoader";

const CategorySelector = ({ categories, selected, onSelect }) => {
  const [openParent, setOpenParent] = useState(null);

  const toggleParent = (id) => {
    setOpenParent(openParent === id ? null : id);
  };

  return (
    <div className="space-y-2">
      <label className="font-semibold text-gray-700 block mb-2">
        Choose a Category
      </label>
      {categories.map((parent) => (
        <div key={parent._id} className="border rounded">
          <button
            type="button"
            className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-yellow-50 transition"
            onClick={() => toggleParent(parent._id)}
          >
            <span>{parent.name}</span>
            <span>{openParent === parent._id ? "▲" : "▼"}</span>
          </button>

          {openParent === parent._id && (
            <div className="bg-white px-4 py-2">
              {parent.children && parent.children.length > 0 ? (
                parent.children.map((child) => (
                  <label
                    key={child._id}
                    className="block py-1 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={child._id}
                      checked={selected === child._id}
                      onChange={() => onSelect(child._id)}
                      className="mr-2"
                    />
                    {child.name}
                  </label>
                ))
              ) : (
                <label className="block py-1 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={parent._id}
                    checked={selected === parent._id}
                    onChange={() => onSelect(parent._id)}
                    className="mr-2"
                  />
                  {parent.name}
                </label>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const AddRecipe = () => {
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
    { name: "", quantity: "", unit: "" },
    { name: "", quantity: "", unit: "" },
  ]);
  const [directions, setDirections] = useState([""]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    cookingTime: "",
    prepTime: "",
    totalTime: "",
    tagName: "",
    cuisines: [],
    servings: "",
    notes: "",
    category: "",
    seasons: [],
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // handleFormSubmit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formDataWithImage = new FormData();
    formDataWithImage.append("title", formData.title);
    formDataWithImage.append("description", formData.description);
    formDataWithImage.append("cookingTime", formData.cookingTime);
    formDataWithImage.append("prepTime", formData.prepTime);
    formDataWithImage.append("totalTime", formData.totalTime);
    formDataWithImage.append("tagName", formData.tagName);
    formDataWithImage.append("cuisines", JSON.stringify(formData.cuisines));
    formDataWithImage.append("servings", formData.servings);
    formDataWithImage.append("notes", formData.notes);
    formDataWithImage.append("category", formData.category);
    formDataWithImage.append("seasons", JSON.stringify(formData.seasons));
    formDataWithImage.append("ingredients", JSON.stringify(ingredients));
    formDataWithImage.append(
      "steps",
      JSON.stringify(directions.map((d) => ({ instruction: d })))
    );
    formDataWithImage.append("image", imageFile);

    setLoading(true);

    try {
      await addRecipe(formDataWithImage);
      toast.success("Recipe added successfully!");
      setFormData({
        title: "",
        description: "",
        cookingTime: "",
        prepTime: "",
        totalTime: "",
        tagName: "",
        cuisines: [],
        servings: "",
        notes: "",
        category: "",
        seasons: [],
      });
      setIngredients([
        { name: "", quantity: "", unit: "" },
        { name: "", quantity: "", unit: "" },
        { name: "", quantity: "", unit: "" },
      ]);
      setDirections([""]);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error adding recipe:", error);
      toast.error(error?.message || "Failed to add recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const handleDirectionChange = (index, value) => {
    const updated = [...directions];
    updated[index] = value;
    setDirections(updated);
  };

  const addDirectionField = () => {
    setDirections([...directions, ""]);
  };

  const removeIngredientField = (index) => {
    if (ingredients.length > 3) {
      const updated = ingredients.filter((_, i) => i !== index);
      setIngredients(updated);
    }
  };

  const removeDirectionField = (index) => {
    if (directions.length > 1) {
      const updated = directions.filter((_, i) => i !== index);
      setDirections(updated);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="relative">
        <img
          src="https://imgs.search.brave.com/7vhfc18BbL_NFXSCgZV0lKURvFKnPDqBZ0tBnSbvLMI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJhY2Nlc3Mu/Y29tL2Z1bGwvMTEy/NjA1LmpwZw"
          alt=""
          className="w-full h-50 object-cover"
        />
        <div className="absolute flex flex-col gap-6 top-20 left-1/2 transform w-[96%] lg:w-[60%] -translate-x-1/2 bg-white shadow-sm px-4 py-6 md:px-10 md:py-8">
          <h1 className="text-3xl relative font-bold text-gray-800 underline decoration-4 decoration-[#FFC107]">
            <span className="absolute -top-2 -left-3 font-bold text-[#FFC107] text-4xl">
              +
            </span>
            Add Recipe
          </h1>
          <p className="text-gray-600">
            Uploading personal recipes is easy! Add yours to your favorites,
            share with friends, family, or the Savorly community.
          </p>

          <div className="h-[1px] bg-[#F3F3F2]"></div>

          {/* Recipe title, description and photo */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="md:w-1/2 flex flex-col">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">
                  Recipe Title
                </label>
                <input
                  type="text"
                  placeholder="Enter recipe title"
                  className="border px-4 py-2 rounded outline-none"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-gray-700">
                  Recipe TagName
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pancake, Salad, Pasta, etc"
                  className="border px-4 py-2 rounded outline-none"
                  name="tagName"
                  value={formData.tagName}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe the recipe..."
                  className="border px-4 py-2 rounded resize-none outline-none"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            {/* Add Recipe photo */}
            <div className="md:w-1/2">
              <label className="font-semibold text-gray-700 block mb-2">
                Recipe Image
              </label>
              <div className="flex w-full items-center gap-4 flex-wrap">
                <label
                  htmlFor="image"
                  className="cursor-pointer flex flex-col items-center justify-center w-full h-70 border-2 border-dashed border-gray-300 rounded-lg  hover:border-yellow-400 transition-all"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                      name="image"
                    />
                  ) : (
                    <div className="text-center md:w-full text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 mx-auto mb-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      <p className="text-sm">Choose Image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    name="image"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Add Ingredients with quantity separately */}
          <div className="mt-6">
            <label className="font-semibold text-gray-700">Ingredients</label>
            {ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="grid md:grid-cols-5 gap-3 mt-3 items-start"
              >
                {/* Ingredient Input - larger */}
                <input
                  type="text"
                  placeholder="Ingredient (e.g. Sugar)"
                  className="md:col-span-2 border px-4 py-2 rounded outline-none"
                  name="name"
                  value={ingredient.name}
                  onChange={(e) =>
                    handleIngredientChange(index, "name", e.target.value)
                  }
                />

                {/* Quantity Input */}
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="e.g. 1 or 1.5"
                    className="border px-4 py-2 rounded outline-none"
                    name="quantity"
                    value={ingredient.quantity}
                    onChange={(e) =>
                      handleIngredientChange(index, "quantity", e.target.value)
                    }
                  />
                  <span className="text-xs text-gray-500 mt-1">
                    Use decimals like <strong>1.5</strong> instead of fractions
                    like <strong>1/2</strong>
                  </span>
                </div>

                {/* Unit Input */}
                <input
                  type="text"
                  placeholder="Unit (e.g. tsp)"
                  className="border px-4 py-2 rounded outline-none"
                  name="unit"
                  value={ingredient.unit}
                  onChange={(e) =>
                    handleIngredientChange(index, "unit", e.target.value)
                  }
                />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeIngredientField(index)}
                  className={`text-red-500 hover:underline text-sm mt-2 md:mt-0 ${
                    ingredients.length <= 3
                      ? "opacity-30 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={ingredients.length <= 3}
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Add More Button */}
            <button
              type="button"
              onClick={addIngredientField}
              className="mt-4 text-sm text-blue-500 hover:underline"
            >
              + Add more ingredients
            </button>
          </div>

          {/* Add Directions */}
          <div>
            <label className="font-semibold text-gray-700">Directions</label>
            {directions.map((step, index) => (
              <div key={index} className="mt-2 flex gap-2 items-start">
                <textarea
                  rows="3"
                  placeholder={`Step ${index + 1}`}
                  className="border px-4 py-2 w-full rounded resize-none outline-none"
                  name="instruction"
                  value={step}
                  onChange={(e) => handleDirectionChange(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeDirectionField(index)}
                  className={`text-red-500 hover:underline text-sm mt-1 ${
                    directions.length <= 1
                      ? "opacity-30 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={directions.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDirectionField}
              className="mt-3 text-sm text-blue-500 hover:underline"
            >
              + Add another step
            </button>
          </div>

          {/* Add Servings, Prep Time, Cook Time and Total Time */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Servings</label>
              <input
                type="text"
                placeholder="e.g. 4"
                className="border px-4 py-2 rounded outline-none"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Prep Time</label>
              <input
                type="text"
                placeholder="e.g. 15 mins"
                className="border px-4 py-2 rounded outline-none"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Cook Time</label>
              <input
                type="text"
                placeholder="e.g. 30 mins"
                className="border px-4 py-2 rounded outline-none"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Total Time</label>
              <input
                type="text"
                placeholder="e.g. 45 mins"
                className="border px-4 py-2 rounded outline-none"
                name="totalTime"
                value={formData.totalTime}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Add Notes */}
          <div>
            <label className="font-semibold text-gray-700">Notes</label>
            <textarea
              rows="3"
              placeholder="Add optional notes or tips..."
              className="border px-4 py-2 w-full rounded resize-none outline-none mt-2"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* ✅ Add Category Section */}
          <CategorySelector
            categories={categories}
            selected={formData.category}
            onSelect={(id) =>
              setFormData((prev) => ({ ...prev, category: id }))
            }
          />

          {/* Cuisines */}
          <div>
            <h2 className="font-semibold text-lg mb-2 mt-4">Cuisines</h2>
            {[
              "Indian",
              "Chinese",
              "Italian",
              "Mexican",
              "American",
              "Spanish",
              "Other",
            ].map((cuisine) => (
              <label key={cuisine} className="block text-sm mb-1">
                <input
                  type="checkbox"
                  value={cuisine}
                  checked={formData.cuisines?.includes(cuisine)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      cuisines: checked
                        ? [...(prev.cuisines || []), value]
                        : (prev.cuisines || []).filter((c) => c !== value),
                    }));
                  }}
                  className="mr-2"
                />
                {cuisine}
              </label>
            ))}
          </div>

          {/* Seasons */}
          <div>
            <h2 className="font-semibold text-lg mb-2 mt-4">Seasons</h2>
            {["Spring", "Summer", "Fall", "Winter"].map((season) => (
              <label key={season} className="block text-sm mb-1">
                <input
                  type="checkbox"
                  value={season}
                  checked={formData.seasons?.includes(season)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const value = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      seasons: checked
                        ? [...(prev.seasons || []), value]
                        : (prev.seasons || []).filter((s) => s !== value),
                    }));
                  }}
                  className="mr-2"
                />
                {season}
              </label>
            ))}
          </div>

          {/* Cancel and Submit Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                setFormData({
                  title: "",
                  tagName: "",
                  description: "",
                  image: "",
                  ingredients: [],
                  directions: [],
                  servings: "",
                  prepTime: "",
                  cookingTime: "",
                  totalTime: "",
                  notes: "",
                  category: "",
                  cuisines: [],
                  seasons: [],
                });
                setImagePreview(null);
                setIngredients([
                  { name: "", quantity: "", unit: "" },
                  { name: "", quantity: "", unit: "" },
                  { name: "", quantity: "", unit: "" },
                ]);
                setDirections(["", "", ""]);
              }}
              className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleFormSubmit}
              className="bg-[#FFC107] w-35 py-2 rounded font-semibold text-white hover:bg-yellow-500 transition cursor-pointer"
            >
              {loading ? <RoundedOneLoader /> : "Submit Recipe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;
