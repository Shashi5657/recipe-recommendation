const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/recipes", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Recipe Schema
const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  instructions: String,
});

const Recipe = mongoose.model("Recipe", recipeSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Recipe Recommendation System API");
});

// Add a recipe
app.post("/recipes", async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Search recipes by ingredients
app.get("/recipes/search", async (req, res) => {
  try {
    const { ingredients } = req.query;
    const ingredientArray = ingredients.split(",");
    const recipes = await Recipe.find({
      ingredients: { $all: ingredientArray },
    });
    res.json(recipes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
