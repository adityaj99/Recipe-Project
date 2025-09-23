import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/Pagination";
import { getAllRecipes, getPopularRecipes } from "../api/recipeApi";
import { RoundedOneLoader } from "../components/RoundedOneLoader";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

const AllRecipes = () => {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRecipes();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    fetchPopularRecipes();
  }, []);

  const fetchRecipes = async () => {
    let limit = 20;
    setLoading(true);
    try {
      const data = await getAllRecipes({ limit, search });
      if (!search || (search && data.recipes.length > 0)) {
        setRecipes(data.recipes);
        setTotalData(data?.total);
        setPageNo(data?.currentPage);
        setTotalPages(data?.TotalPages);
      } else {
        setRecipes([]);
        setTotalData(0);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const fetchPopularRecipes = async () => {
    try {
      const data = await getPopularRecipes();
      setPopularRecipes(data?.recipes);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="w-full h-20 flex items-center justify-center px-2 lg:px-40 mx-auto sticky top-0 bg-black z-10">
        <input
          className="bg-white p-2 w-full"
          type="text"
          placeholder="Find the recipe"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="py-4 xl:px-40 px-2 xl:py-10">
        <h1 className="text-2xl font-bold uppercase tracking-widest">
          {totalData} results
        </h1>
      </div>
      <div className="flex  gap-4 px-4 py-4 lg:px-40 flex-wrap">
        {loading ? (
          <div className="w-screen flex justify-center">
            <RoundedOneLoader />
          </div>
        ) : recipes.length > 0 ? (
          recipes.map((dish) => (
            <div key={dish?._id}>
              <RecipeCard
                id={dish._id}
                title={dish?.title}
                image={dish?.image?.url}
                date={dish?.createdAt}
              />
            </div>
          ))
        ) : (
          <div className="flex h-screen items-center justify-center py-4">
            No Recipe Found
          </div>
        )}
      </div>

      {!loading && recipes?.length > 0 && (
        <div className="px-4 xl:px-40 py-10 flex justify-end">
          <Pagination />
        </div>
      )}

      {/* popular recipes */}
      <div className="px-4 py-4 lg:px-40">
        <h1 className="text-2xl font-semibold pb-4">Popular Recipes</h1>

        <div className="flex items-start gap-4">
          {popularRecipes?.map((dish) => (
            <div key={dish?._id}>
              <RecipeCard
                id={dish._id}
                title={dish?.title}
                image={dish?.image?.url}
                date={dish?.createdAt}
              />
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllRecipes;
