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

  const fetchRecipes = async () => {
    try {
      const data = await getRecipesByCategorySlug(slug);
      setRecipes(data?.recipes);
      console.log(data);
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
          className="h-80 lg:h-60 xl:h-80 w-full object-cover"
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
        <div className="w-full px-40">
          <p className="text-sm xl:text-base text-center">{desc}</p>
        </div>
      </div>

      <div className="px-4 lg:px-20 xl:px-40">
        <div className="flex md:flex-row flex-wrap my-15 gap-2 xl:gap-2">
          {recipes.length > 0 &&
            recipes?.map((dish) => (
              <RecipeCard
                key={dish._id}
                id={dish._id}
                title={dish.title}
                image={dish?.image?.url}
                date={dish?.createdAt}
                averageRating={dish?.averageRating}
                totalReviews={dish?.totalReviews}
              />
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Category;
