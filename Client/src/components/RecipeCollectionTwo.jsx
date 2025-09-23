import React, { useEffect, useState } from "react";

const RecipeCollectionTwo = ({ collections }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  console.log("sec coll", collections);

  return (
    <div className="flex flex-col lg:flex-row border-2 border-[#F3F3F2]">
      <div className="lg:w-[60%]">
        <img src={collections?.image?.url} alt="" />
      </div>
      <div className="flex flex-col justify-center gap-2 p-4 lg:w-[40%]">
        <p className="text-sm">collection</p>
        <h1 className="text-2xl font-medium">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, odit!
        </h1>
        {!isMobile && (
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem
            consectetur, doloribus cupiditate consequuntur perspiciatis
            mollitia, ab in aliquid natus quasi nemo harum officia totam
            temporibus.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecipeCollectionTwo;
