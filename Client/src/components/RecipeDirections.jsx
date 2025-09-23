import { useState } from "react";

const RecipeDirections = ({ steps, notes }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleStep = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mt-10">
      <h2 className="printable-content text-3xl font-bold mb-4">Directions</h2>
      <div className="space-y-4 mb-8">
        {steps?.map((step, index) => (
          <div
            key={index}
            className="border border-gray-700 transition duration-300"
          >
            <button
              className="w-full text-left px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
              onClick={() => toggleStep(index)}
            >
              <span className="font-semibold text-gray-800">
                Step {index + 1}
              </span>
              <span className="text-sm text-gray-500">
                {openIndex === index ? "Hide" : "Show"}
              </span>
            </button>
            <div
              className={`px-4 overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96 py-3" : "max-h-0"
              }`}
            >
              <p className="printable-content handwritten text-xl">
                {step?.instruction}
              </p>
            </div>
          </div>
        ))}
      </div>

      {notes !== "" && (
        <div className="printable-content paper-stripes  rounded-lg max-w-xl mx-auto relative torn-paper">
          <h1 className="text-2xl handwritten mb-7">Cook's Notes✏️</h1>
          <p className="handwritten text-xl pb-2">{notes}</p>
        </div>
      )}
    </section>
  );
};

export default RecipeDirections;
