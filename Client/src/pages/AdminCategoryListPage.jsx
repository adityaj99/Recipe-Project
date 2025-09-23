import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllCategories } from "../api/recipeApi";

const AdminCategoryListPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories.");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-5 md:px-10 md:py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Categories</h1>

      <div className="flex justify-end py-4 ">
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-2 bg-[#e7edf4] text-[#0d151c] text-sm font-medium leading-normal">
          <span
            onClick={() => navigate("/admin/category/add")}
            className="truncate"
          >
            New Category
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {filteredCategories.length > 0 ? (
        filteredCategories.map((category) => (
          <div
            key={category._id}
            className="border rounded shadow mb-8 overflow-hidden bg-white"
          >
            {/* Category Section */}
            <div className="flex flex-col p-2">
              <img
                src={category.image.url}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-1">
                <h2 className="text-2xl font-semibold">{category.name}</h2>
                <p className="text-gray-600">{category.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Slug: {category.slug}
                </p>
              </div>
            </div>

            {/* Subcategories */}
            {category.children?.length > 0 && (
              <div className="p-4 bg-gray-50">
                <h3 className="text-lg font-medium mb-3">
                  Subcategories ({category.children.length})
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.children.map((sub) => (
                    <div
                      key={sub._id}
                      className="border rounded-lg overflow-hidden p-2 bg-white shadow-sm"
                    >
                      <img
                        src={sub.image.url}
                        alt={sub.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-3">
                        <h4 className="font-semibold">{sub.name}</h4>
                        <p className="text-sm text-gray-600">
                          {sub.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No categories found.</p>
      )}
    </div>
  );
};

export default AdminCategoryListPage;
