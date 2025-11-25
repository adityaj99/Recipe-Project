import RecipeCard from "./RecipeCard";

const PopularRecipes = ({ popularRecipes, loading }) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medium lg:text-4xl my-4 uppercase">
          Popular Recipes
        </h1>
      </div>
      <div className="flex gap-2 flex-wrap">
        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-34 min-h-65 md:w-60 xl:w-73 bg-[#F3F3F2] animate-pulse"
            ></div>
          ))}

        {popularRecipes?.map((dish) => (
          <RecipeCard
            key={dish?._id}
            id={dish?._id}
            title={dish?.title}
            image={dish?.image?.url}
            date={dish?.createdAt}
            averageRating={dish?.averageRating}
            totalReviews={dish?.totalReviews}
          />
        ))}
      </div>
    </div>
  );
};

export default PopularRecipes;
