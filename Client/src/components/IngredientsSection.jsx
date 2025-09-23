import { useState } from "react";

import { FaCheckCircle } from "react-icons/fa";

const IngredientsSection = ({ ingredients, servings }) => {
  const [multiple, setMultiple] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="printable-content text-3xl font-semibold">Ingredients</h2>

      <div className="flex border border-gray-300 rounded-4xl w-fit">
        <div
          onClick={() => setMultiple(1)}
          className={`border-r rounded-l-4xl border-gray-300 ${
            multiple === 1 && "bg-[#F5F7EB]"
          } px-4 py-2 cursor-pointer`}
        >
          <p>1X</p>
        </div>
        <div
          onClick={() => setMultiple(2)}
          className={`border-r ${
            multiple === 2 && "bg-[#F5F7EB]"
          } border-gray-300 px-4 py-2 cursor-pointer`}
        >
          <p>2X</p>
        </div>
        <div
          onClick={() => setMultiple(4)}
          className={`px-4 py-2 ${
            multiple === 4 && "bg-[#F5F7EB] rounded-r-4xl cursor-pointer"
          }`}
        >
          <p>4X</p>
        </div>
      </div>

      <p className="text-gray-600 italic">
        Recipe ({multiple}X) yields {servings * multiple} servings
      </p>
      <ul className="printable-content space-y-4">
        {ingredients?.map((item) => (
          <li
            key={item._id}
            className="flex items-start gap-2 text-base text-gray-800"
          >
            <FaCheckCircle className="text-[#F5CE35] mt-1" />
            <span className="handwritten text-xl">
              <span>
                {item?.unit !== "" &&
                  item?.quality !== "" &&
                  item.quantity &&
                  item.quantity * multiple}{" "}
                {item?.unit !== "" && item?.unit}
              </span>{" "}
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsSection;
