import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { getAllCategories } from "../api/recipeApi";
import { createCategory } from "../api/adminApi";
import { useNavigate } from "react-router-dom";

const AdminCategoryPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [categoryData, setCategoryData] = useState({
    name: "",
    description: "",
    image: null,
  });

  const [subcategoryData, setSubcategoryData] = useState({
    parentCategory: "",
    name: "",
    description: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const categoryImageRef = useRef(null);
  const subcategoryImageRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await getAllCategories();
    setCategories(data);
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubcategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubcategoryData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", categoryData?.name);
    formData.append("description", categoryData?.description);
    formData.append("image", categoryData?.image);

    const data = await createCategory(formData);
    toast.success(`Category "${categoryData.name}" created successfully!`);
    setCategoryData({
      name: "",
      description: "",
      image: null,
    });
    setImagePreview(null);
  };

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    const selectedCategory = categories.find(
      (cat) => cat._id === subcategoryData.parentCategory
    );

    const formData = new FormData();
    formData.append("name", subcategoryData.name);
    formData.append("description", subcategoryData.description);
    formData.append("image", subcategoryData.image);
    formData.append("parentCategory", subcategoryData.parentCategory);

    try {
      const data = await createCategory(formData);

      toast.success(
        `Subcategory "${subcategoryData.name}" added to "${selectedCategory?.name}"!`
      );
      setSubcategoryData({
        parentCategory: "",
        name: "",
        description: "",
        image: null,
      });
      setImagePreview(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-2 max-w-5xl mx-auto space-y-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 w-fit text-sm text-blue-600 hover:underline"
      >
        ← Back
      </button>
      {/* Category Section */}
      <section className="border rounded-lg shadow-lg p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">Create Category</h2>

        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Category Name"
            value={categoryData.name}
            onChange={(e) =>
              setCategoryData({ ...categoryData, name: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
            required
          />
          <textarea
            placeholder="Category Description"
            value={categoryData.description}
            onChange={(e) =>
              setCategoryData({ ...categoryData, description: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
          />

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-1">Category Image</label>
            <div
              onClick={() => categoryImageRef.current.click()}
              className="w-60 h-40 border rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100 hover:bg-gray-200"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Click to upload</span>
              )}
            </div>
            <input
              type="file"
              ref={categoryImageRef}
              accept="image/*"
              className="hidden"
              onChange={handleCategoryImageChange}
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Category
          </button>
        </form>
      </section>

      {/* Subcategory Section */}
      <section className="border rounded-lg shadow-lg p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">Create Subcategory</h2>
        <form onSubmit={handleSubcategorySubmit} className="space-y-4">
          <select
            value={subcategoryData.parentCategory}
            onChange={(e) =>
              setSubcategoryData({
                ...subcategoryData,
                parentCategory: e.target.value,
              })
            }
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Subcategory Name"
            value={subcategoryData.name}
            onChange={(e) =>
              setSubcategoryData({ ...subcategoryData, name: e.target.value })
            }
            className="w-full p-2 border rounded-lg"
            required
          />
          <textarea
            placeholder="Subcategory Description"
            value={subcategoryData.description}
            onChange={(e) =>
              setSubcategoryData({
                ...subcategoryData,
                description: e.target.value,
              })
            }
            className="w-full p-2 border rounded-lg"
          />

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-1">Subcategory Image</label>
            <div
              onClick={() => subcategoryImageRef.current.click()}
              className="w-60 h-40 border rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-gray-100 hover:bg-gray-200"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">Click to upload</span>
              )}
            </div>
            <input
              type="file"
              ref={subcategoryImageRef}
              accept="image/*"
              className="hidden"
              onChange={handleSubcategoryImageChange}
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Subcategory
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminCategoryPage;
