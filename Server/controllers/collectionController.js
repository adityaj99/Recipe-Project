import collectionModel from "../models/collection.models.js";
import recipeModel from "../models/recipe.models.js";

export const createCollection = async (req, res) => {
  try {
    const { name, description, recipes, status } = req.body;

    const image = {
      url: req.file.path,
      public_id: req.file.filename,
    };

    const collection = await collectionModel.create({
      name,
      description,
      image,
      recipes,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Collection created successfully",
      collection,
    });
  } catch (error) {
    console.error("Error creating collection:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getAllCollections = async (req, res) => {
  try {
    const collections = await collectionModel
      .find()
      .populate("recipes", "title status image createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: collections.length,
      collections,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await collectionModel
      .findById(id)
      .populate("recipes", "title status image createdAt");

    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    res.status(200).json({ success: true, collection });
  } catch (error) {
    console.error("Error fetching collection:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, description, status } = req.body;

    const updates = {
      name,
      description,
      status,
    };

    let recipesVal = req.body["recipes[]"] || req.body.recipes;

    if (Array.isArray(recipesVal)) {
      updates.recipes = recipesVal;
    } else if (typeof recipesVal === "string") {
      try {
        const parsed = JSON.parse(recipesVal);
        if (Array.isArray(parsed)) {
          updates.recipes = parsed;
        } else {
          updates.recipes = [parsed];
        }
      } catch {
        const splitted = recipesVal
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (splitted.length) updates.recipes = splitted;
      }
    }

    if (req.file) {
      updates.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const collection = await collectionModel
      .findByIdAndUpdate(id, updates, {
        new: true,
      })
      .populate("recipes", "title status image createdAt");

    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    res.status(200).json({
      success: true,
      message: "Collection updated successfully",
      collection,
    });
  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await collectionModel.findByIdAndDelete(id);

    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    res.status(200).json({ success: true, message: "Collection deleted" });
  } catch (error) {
    console.error("Error deleting collection:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
