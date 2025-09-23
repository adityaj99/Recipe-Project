import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllRecipes, getCollectionById } from "../api/recipeApi";
import { createCollection, updateCollection } from "../api/adminApi";
import { toast } from "react-toastify";

const AdminCollections = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    status: "draft",
    recipes: [],
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!search.trim()) return;
      getAllRecipes({ limit: 20, search })
        .then((data) => setRecipes(data?.recipes || []))
        .catch((err) => console.error(err));
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);


  useEffect(() => {
    if (!id) return; 
    const fetchCollection = async () => {
      try {
        const data = await getCollectionById(id);
        setForm({
          name: data.collection.name || "",
          description: data.collection.description || "",
          image: data.collection.image?.url || "",
          status: data.collection.status || "draft",
          recipes: data.collection.recipes || [],
        });

      } catch (err) {
        console.error(err);
        toast.error("Failed to load collection");
      }
    };
    fetchCollection();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSelectRecipe = (recipe) => {
    setForm((prev) => {
      if (prev.recipes.find((r) => r._id === recipe._id)) return prev;
      return { ...prev, recipes: [...prev.recipes, recipe] };
    });
  };

  const removeRecipeFromForm = (id) => {
    setForm((prev) => ({
      ...prev,
      recipes: prev.recipes.filter((r) => r._id !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("status", form.status);
      if (form.image && typeof form.image !== "string") {
        formData.append("image", form.image);
      }
      form.recipes.forEach((recipe) =>
        formData.append("recipes[]", recipe._id)
      );

      if (id) {
        const data = await updateCollection(id, formData);
        toast.success("Collection updated!");
      } else {
        await createCollection(formData);
        toast.success("Collection created!");
      }

      navigate("/admin/collections");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => fileInputRef.current.click();

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 w-fit text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold">
        {id ? "Edit Collection" : "Add Collection"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 border rounded-lg shadow-md"
      >
        <input
          type="text"
          name="name"
          placeholder="Collection Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Image */}
        <div>
          <label className="block font-medium mb-1">Collection Image</label>
          <div
            onClick={handleImageClick}
            className="w-40 h-40 border rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100 hover:bg-gray-200"
          >
            {form.imagePreview || form.image ? (
              <img
                src={
                  form.imagePreview ||
                  (typeof form.image === "string" ? form.image : "")
                }
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500">Click to upload</span>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        {/* Recipe search */}
        <div className="p-4">
          <label className="block font-medium mb-1">Search Recipes</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by recipe title"
            className="w-full border p-2 rounded"
          />
          {recipes.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  onClick={() => handleSelectRecipe(recipe)}
                  className="border rounded-lg p-2 flex flex-col items-center cursor-pointer hover:shadow hover:bg-gray-100 transition"
                >
                  <img
                    src={recipe?.image?.url || "/placeholder.png"}
                    alt={recipe.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <p className="text-sm font-medium text-center mt-2">
                    {recipe.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {form.recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-gray-200 px-3 py-1 rounded flex items-center gap-2"
            >
              {recipe.title}
              <button
                type="button"
                onClick={() => removeRecipeFromForm(recipe._id)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {id ? "Update Collection" : "Create Collection"}
        </button>
      </form>
    </div>
  );
};

export default AdminCollections;
