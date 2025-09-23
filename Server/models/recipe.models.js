import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String },
  unit: { type: String }, // grams, tbsp, cups
});

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    ingredients: [ingredientSchema],
    steps: [
      {
        instruction: { type: String, required: true },
      },
    ],

    notes: { type: String }, // optional chef notes

    image: {
      url: { type: String },
      public_id: { type: String },
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: { type: String },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isTrending: { type: Boolean, default: false },
    cuisines: [
      {
        type: String,
        enum: [
          "Indian",
          "Italian",
          "Mexican",
          "Chinese",
          "Thai",
          "American",
          "Japanese",
          "French",
          "Spanish",
          "German",
          "Other",
        ],
      },
    ],
    seasons: [{ type: String }],
    prepTime: { type: Number },
    cookingTime: { type: Number },
    totalTime: { type: Number },
    servings: { type: Number },
    tagName: { type: String },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
