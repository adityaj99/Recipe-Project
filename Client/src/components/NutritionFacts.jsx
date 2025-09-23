const NutritionFacts = ({ data }) => {
  return (
    <div className="w-full bg-white border-2 border-black p-4 text-black font-sans">
      <h2 className="text-2xl font-extrabold border-b-4 border-black pb-1 mb-2 uppercase">
        Nutrition Facts
      </h2>

      {/* <div className="text-sm mb-2">Serving Size {data.servingSize}</div> */}
      <div className="text-sm mb-2 border-b border-black pb-1">
        Servings Per Recipe {data.servingsPerContainer}
      </div>

      {/* <div className="text-xs uppercase font-bold mb-1 border-b-4 border-black py-1">
        Amount Per Serving
      </div> */}

      <div className="flex justify-between border-b-4 border-black font-bold text-lg mb-1">
        <span>Calories</span>
        <span>{data?.calories}</span>
      </div>

      <div className="flex justify-end text-xs font-bold uppercase border-b border-black py-2">
        <span>% Daily Value *</span>
      </div>

      {data?.nutrients?.map((item) => (
        <div
          key={item._id}
          className={`flex justify-between text-sm border-b border-black py-1`}
        >
          <span>
            {item?.label} {item?.amount}
          </span>
          {item.dailyValue && <span>{item?.dailyValue}</span>}
        </div>
      ))}

      <div className="text-xs mt-2">
        * Percent Daily Values are based on a 2,000 calorie diet.
      </div>
    </div>
  );
};

export default NutritionFacts;
