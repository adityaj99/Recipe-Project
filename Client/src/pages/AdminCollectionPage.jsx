import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getCollections } from "../api/recipeApi";

const AdminCollectionPage = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [collections, setCollections] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const data = await getCollections();
      setCollections(data?.collections);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-1 py-5 md:px-10 md:py-10">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        {/* Header */}
        <div className="flex flex-wrap justify-between gap-3 ">
          <p className="text-[#0d151c] tracking-light text-[32px] font-bold leading-tight min-w-72">
            Recipe Collections
          </p>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#e7edf4] text-[#0d151c] text-sm font-medium leading-normal">
            <span
              onClick={() => navigate("/admin/collections/add")}
              className="truncate"
            >
              New Collection
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-[#49749c] flex border-none bg-[#e7edf4] items-center justify-center pl-4 rounded-l-xl border-r-0">
                🔍
              </div>
              <input
                placeholder="Search collections"
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d151c] focus:outline-0 focus:ring-0 border-none bg-[#e7edf4] focus:border-none h-full placeholder:text-[#49749c] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </label>
        </div>

        {/* Collection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {filteredCollections.length > 0 ? (
            filteredCollections.map((col) => {
              const isExpanded = expanded[col._id];
              const displayedRecipes = isExpanded
                ? col.recipes
                : col.recipes.slice(0, 2);

              return (
                <div
                  key={col._id}
                  className="bg-white border border-[#cedce8] rounded shadow hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <img
                    src={col?.image?.url}
                    alt={col?.name}
                    className="w-full md:h-60 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#0d151c]">
                      {col.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {col.description}
                    </p>

                    {/* Recipes */}
                    <ul className="text-sm text-gray-700 mb-3 list-disc list-inside">
                      {displayedRecipes.map((recipe) => (
                        <li key={recipe?._id}>{recipe.title}</li>
                      ))}
                    </ul>

                    {/* Show More / Show Less */}
                    {col.recipes.length > 2 && (
                      <button
                        onClick={() => toggleExpand(col._id)}
                        className="text-[#49749c] text-sm font-medium hover:underline mb-3"
                      >
                        {isExpanded
                          ? "Show Less"
                          : `Show More (${col.recipes.length - 2})`}
                      </button>
                    )}

                    {/* View Collection */}
                    <button
                      onClick={() => navigate(`/admin/collections/${col._id}`)}
                      className="text-[#49749c] font-medium hover:underline"
                    >
                      View Collection
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="px-4">No collections found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCollectionPage;
