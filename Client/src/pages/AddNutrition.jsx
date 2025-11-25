import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import { addNutrition, getNutritionInfo } from "../api/recipeApi";
import { RoundedOneLoader } from "../components/RoundedOneLoader";
import { useEffect } from "react";

const AddNutrition = () => {
  const { recipeId } = useParams();

  const [formData, setFormData] = useState({
    servingsPerContainer: "",
    calories: "",
  });

  const [nutrients, setNutrients] = useState([
    { label: "", amount: "", dailyValue: "" },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNutrition = async () => {
      try {
        const data = await getNutritionInfo(recipeId);

        setFormData({
          servingsPerContainer: data.servingsPerContainer || "",
          calories: data.calories || "",
        });

        setNutrients(
          data.nutrients?.length
            ? data.nutrients
            : [{ label: "", amount: "", dailyValue: "" }]
        );
      } catch (error) {
        return null;
      }
    };

    fetchNutrition();
  }, [recipeId]);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNutrientChange = (index, field, value) => {
    const updated = [...nutrients];
    updated[index][field] = value;
    setNutrients(updated);
  };

  const addNutrientField = () => {
    setNutrients([...nutrients, { label: "", amount: "", dailyValue: "" }]);
  };

  const removeNutrientField = (index) => {
    if (nutrients.length > 1) {
      setNutrients(nutrients.filter((_, i) => i !== index));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addNutrition({
        ...formData,
        nutrients,
        recipeId,
      });
      toast.success("Nutrition info added successfully!");
      setFormData({
        servingsPerContainer: "",
        calories: "",
      });
      setNutrients([{ label: "", amount: "", dailyValue: "" }]);
    } catch (error) {
      console.error("Error adding nutrition:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add nutrition info. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1506806732259-39c2d0268443"
          alt=""
          className="w-full h-50 object-cover"
        />
        <div className="absolute flex flex-col gap-6 top-20 left-1/2 transform w-[96%] lg:w-[60%] -translate-x-1/2 bg-white shadow-sm px-4 py-6 md:px-10 md:py-8">
          <h1 className="text-3xl relative font-bold text-gray-800 underline decoration-4 decoration-[#FFC107]">
            <span className="absolute -top-2 -left-3 font-bold text-[#FFC107] text-4xl">
              +
            </span>
            Add Nutrition Info
          </h1>
          <p className="text-gray-600">
            Provide nutritional details for this recipe. Required fields:{" "}
            <strong>Servings, Calories, Nutrients</strong>.
          </p>

          <div className="h-[1px] bg-[#F3F3F2]"></div>

          {/* Form fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Servings Per Container
              </label>
              <input
                type="number"
                name="servingsPerContainer"
                value={formData?.servingsPerContainer}
                onChange={handleChange}
                placeholder="e.g. 2"
                className="border px-4 py-2 rounded outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Calories</label>
              <input
                type="number"
                name="calories"
                value={formData?.calories}
                onChange={handleChange}
                placeholder="e.g. 250"
                className="border px-4 py-2 rounded outline-none"
              />
            </div>
          </div>

          {/* Nutrients section */}
          <div className="mt-6">
            <label className="font-semibold text-gray-700">Nutrients</label>
            {nutrients?.map((nutrient, index) => (
              <div
                key={index}
                className="grid md:grid-cols-4 gap-3 mt-3 items-start"
              >
                <input
                  type="text"
                  placeholder="Label (e.g. Protein)"
                  className="border px-4 py-2 rounded outline-none"
                  value={nutrient?.label}
                  onChange={(e) =>
                    handleNutrientChange(index, "label", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Amount (e.g. 5g)"
                  className="border px-4 py-2 rounded outline-none"
                  value={nutrient?.amount}
                  onChange={(e) =>
                    handleNutrientChange(index, "amount", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Daily Value (e.g. 10%)"
                  className="border px-4 py-2 rounded outline-none"
                  value={nutrient?.dailyValue}
                  onChange={(e) =>
                    handleNutrientChange(index, "dailyValue", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeNutrientField(index)}
                  className={`text-red-500 hover:underline text-sm mt-2 md:mt-0 ${
                    nutrients.length <= 1 ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                  disabled={nutrients?.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNutrientField}
              className="mt-4 text-sm text-blue-500 hover:underline"
            >
              + Add more nutrients
            </button>
          </div>

          {/* Cancel and Submit */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => {
                setFormData({ servingsPerContainer: "", calories: "" });
                setNutrients([{ label: "", amount: "", dailyValue: "" }]);
              }}
              className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleFormSubmit}
              className="bg-[#FFC107] w-35 py-2 rounded font-semibold text-white hover:bg-yellow-500 transition"
            >
              {loading ? <RoundedOneLoader /> : "Submit Nutrition"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNutrition;
