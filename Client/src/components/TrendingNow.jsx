import { useNavigate } from "react-router-dom";
import RecipeCard from "./RecipeCard";

const TrendingNow = ({ trendingRecipes }) => {
  
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medium lg:text-4xl my-4 uppercase">
          Trending Now
        </h1>
      </div>
      <div className="flex gap-4 flex-wrap">
        {trendingRecipes.map((dish) => (
          <RecipeCard
            id={dish?._id}
            title={dish?.title}
            image={dish?.image?.url}
            date={dish?.createdAt}
            key={dish?._id}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingNow;
