import Navbar from "../components/Navbar";

import { RiSearchLine } from "react-icons/ri";
import RecipeCard from "../components/RecipeCard";
import Footer from "../components/Footer";
import { getRecipesByCategorySlug } from "../api/recipeApi";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Category = () => {
  const { slug } = useParams();

  useEffect(() => {
    fetchRecipes();
  }, [slug]);

  const [recipes, setRecipes] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");

  const popularSearches = [
    { name: "chicken" },
    { name: "biryani" },
    { name: "brownei" },
    { name: "cake" },
    { name: "lunch" },
    { name: "dinner" },
    { name: "veg" },
    { name: "non-veg" },
  ];

  const fetchRecipes = async () => {
    try {
      const data = await getRecipesByCategorySlug(slug);
      setRecipes(data?.recipes);
      setName(data?.name);
      setDesc(data?.description);
      setImage(data?.image?.url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="w-full lg:mt-10">
        <img
          className="h-80 w-full object-cover"
          src={
            image ||
            "https://www.allrecipes.com/thmb/zMYEHY5anMrplRcqciuDCjH7Cio=/1900x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/705937_Grilled-Asian-Chicken-2000-e7e11131fd29411ab259bd23e772ef2b.jpg"
          }
          alt=""
        />
      </div>

      <div className="flex flex-col items-center px-4 gap-2 my-8">
        <p>Recipes</p>
        <h1 className="text-3xl">{name}</h1>
        <p className="text-sm text-center">{desc}</p>
      </div>

      <div className="px-4 lg:px-40">
        <div className="flex flex-col lg:flex-row bg-amber-50 p-6 gap-4 lg:gap-15 border-2 border-[#F3F3F2]">
          <div className="flex lg:w-1/2 flex-col gap-4">
            <div className="flex items-center gap-2">
              <img
                src="https://imgs.search.brave.com/BBJxBE3T8A6pVA4XSQg7ubxpZ-yDOX4qtTIivmq3mqo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbmdp/bWcuY29tL3VwbG9h/ZHMvY2hlZi9jaGVm/X1BORzEzNC5wbmc"
                alt=""
                className="w-6 h-6 rounded-full bg-amber-500 p-[.5px]"
              />
              <h1 className="text-xl">What would you like to cook?</h1>
            </div>
            <div className="flex h-10 lg:h-12 items-center border-2 border-[#F3F3F2] rounded-sm">
              <input
                className="w-[85%] lg:w-[90%] p-2 h-full bg-white placeholder:uppercase"
                placeholder="Search recipes..."
                type="text"
              />
              <div className="w-[15%] lg:w-[10%] h-full bg-[#F5CE35] flex items-center justify-center">
                <RiSearchLine />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-sm">Popular searches</h1>
            <div className="flex flex-wrap gap-4">
              {popularSearches.map((item, indx) => {
                return (
                  <p
                    key={indx}
                    className="bg-[#F5CE35] py-1 px-2 rounded-sm uppercase"
                  >
                    {item.name}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-wrap my-15 gap-4 xl:gap-6">
          {recipes.length > 0 &&
            recipes?.map((dish) => (
              <div key={dish._id}>
                <RecipeCard
                  id={dish._id}
                  title={dish.title}
                  image={dish?.image?.url}
                />
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Category;
