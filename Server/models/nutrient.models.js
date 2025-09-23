import mongoose from "mongoose";

const nutrientSchema = new mongoose.Schema({
  label: { type: String, required: true },
  amount: { type: String, required: true },
  dailyValue: { type: String },
});

const nutritionFactSchema = new mongoose.Schema(
  {
    servingsPerContainer: { type: Number, required: true },
    calories: { type: Number, required: true },
    nutrients: [nutrientSchema],
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("NutritionFact", nutritionFactSchema);
