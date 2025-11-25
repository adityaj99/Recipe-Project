// import React, { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import RecipeCard from "../components/RecipeCard";
// import Pagination from "../components/Pagination";
// import { getAllRecipes } from "../api/recipeApi";
// import { RoundedOneLoader } from "../components/RoundedOneLoader";

// const AllRecipes = () => {
//   const [search, setSearch] = useState("");
//   const [recipes, setRecipes] = useState([]);
//   const [totalData, setTotalData] = useState(0);
//   const [pageNo, setPageNo] = useState(1);
//   const [totalPages, setTotalPages] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       fetchRecipes();
//     }, 500);

//     return () => clearTimeout(delayDebounce);
//   }, [search]);

//   const fetchRecipes = async () => {
//     let limit = 20;
//     setLoading(true);
//     try {
//       const data = await getAllRecipes({ limit, search });
//       if (!search || (search && data.recipes.length > 0)) {
//         setRecipes(data.recipes);
//         setTotalData(data?.total);
//         setPageNo(data?.currentPage);
//         setTotalPages(data?.TotalPages);
//       } else {
//         setRecipes([]);
//         setTotalData(0);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <div className="w-full h-20 flex items-center justify-center px-2 lg:px-40 mx-auto sticky top-0 bg-black z-10">
//         <input
//           className="bg-white p-2 w-full"
//           type="text"
//           placeholder="Find the recipe"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>
//       <div className="py-4 xl:px-40 px-2 xl:py-10">
//         <h1 className="text-2xl font-bold uppercase tracking-widest">
//           {totalData} results
//         </h1>
//       </div>
//       <div className="flex gap-2 px-4 py-4 lg:px-40 flex-wrap">
//         {loading ? (
//           Array.from({ length: 8 }).map((_, index) => (
//             <div
//               key={index}
//               className="w-34 h-55 md:w-60 md:h-65 lg:w-74 lg:h-70 bg-[#F3F3F2] animate-pulse"
//             ></div>
//           ))
//         ) : recipes.length > 0 ? (
//           recipes.map((dish) => (
//             <div key={dish?._id}>
//               <RecipeCard
//                 id={dish._id}
//                 title={dish?.title}
//                 image={dish?.image?.url}
//                 date={dish?.createdAt}
//               />
//             </div>
//           ))
//         ) : (
//           <div className="flex h-screen items-center justify-center py-4">
//             No Recipe Found
//           </div>
//         )}
//       </div>

//       {!loading && recipes?.length > 0 && (
//         <div className="px-4 xl:px-40 py-10 flex justify-end">
//           <Pagination />
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// };

// export default AllRecipes;

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/Pagination";
import { getAllRecipes } from "../api/recipeApi";
import { FaSearch } from "react-icons/fa";

const AllRecipes = () => {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch recipes when search changes (debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      setPageNo(1); // reset to page 1 on new search
      fetchRecipes(1);
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  // Fetch recipes when page changes
  useEffect(() => {
    fetchRecipes(pageNo);
  }, [pageNo]);

  const fetchRecipes = async (page = 1) => {
    const limit = 20;
    setLoading(true);

    try {
      const data = await getAllRecipes({ limit, search, page });

      console.log(data);

      if (!search || (search && data.recipes.length > 0)) {
        setRecipes(data.recipes);
        setTotalData(data.total);
        setTotalPages(data.totalPages);
      } else {
        setRecipes([]);
        setTotalData(0);
      }
    } catch (error) {
      console.error("Home page data load failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Search Bar */}
      <div className="w-full h-20 flex items-center justify-center px-2 lg:px-40 xl:px-70 mx-auto sticky top-0 bg-black z-10">
        <div className="w-full flex flex-col bg-white py-1 px-4">
          <div className="flex items-center gap-2">
            <h1 className="hidden lg:block w-[26%] xl:w-[18%] text-xl font-semibold tracking-wide uppercase">
              I want to make
            </h1>
            <div className="w-full flex items-center gap-1">
              <FaSearch className="text-[#F5CE35]" />
              <input
                className="p-2 focus:outline-none w-full sm:placeholder:visible placeholder:lg:invisible"
                type="text"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full h-1 bg-amber-400"></div>
        </div>
      </div>

      {/* Total Results */}
      <div className="py-4 xl:px-40 px-2 xl:py-10">
        <h1 className="text-2xl font-bold uppercase tracking-widest">
          {totalData} results
        </h1>
      </div>

      {/* Recipe Cards */}
      <div className="flex min-h-[410px] gap-2 px-4 py-4 lg:px-40 flex-wrap">
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="w-34 h-55 md:w-60 md:h-65 lg:w-74 lg:h-70 bg-[#F3F3F2] animate-pulse rounded"
            ></div>
          ))
        ) : recipes.length > 0 ? (
          recipes.map((dish) => (
            <div key={dish._id}>
              <RecipeCard
                id={dish._id}
                title={dish?.title}
                image={dish?.image?.url}
                date={dish?.createdAt}
                averageRating={dish?.averageRating}
                totalReviews={dish?.totalReviews}
              />
            </div>
          ))
        ) : (
          <div className="w-full flex h-[30vh] items-center justify-center py-4 text-lg font-medium">
            No Recipe Found
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && recipes.length > 0 && totalPages > 1 && (
        <div className="px-4 xl:px-40 py-10 flex justify-end">
          <Pagination
            currentPage={pageNo}
            totalPages={totalPages}
            onPageChange={(page) => setPageNo(page)}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AllRecipes;
