import { useEffect, useState } from "react";
import { getCollectionById } from "../api/recipeApi";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import RecipeCard from "../components/RecipeCard";
import { useParams } from "react-router-dom";

const Collections = () => {
  const { collectionId } = useParams();

  const [recipes, setRecipes] = useState([]);
  const [colName, setColName] = useState("");
  const [coldesc, setColDesc] = useState("");

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const data = await getCollectionById(collectionId);
      setRecipes(data?.collection?.recipes);
      setColName(data?.collection?.name);
      setColDesc(data?.collection?.description);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="w-full min-h-screen p-4 lg:px-40">
        <h1 className="text-2xl text-center pt-10 lg:text-4xl">{colName}</h1>
        <p className="text-center pt-5 pb-10">{coldesc}</p>
        <div className="flex flex-col md:flex-row">
          {recipes?.map((dish) => {
            return (
              <RecipeCard
                id={dish?._id}
                title={dish?.title}
                image={dish?.image.url}
                date={dish?.createdAt}
                key={dish?._id}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Collections;
