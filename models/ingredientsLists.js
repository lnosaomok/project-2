const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientListSchema = Schema({
    name: [{ type: String }],
    ingredientsList: [{ type: String }],
    user: { type: String },
});
const IngredientList = mongoose.model("IngredientList", ingredientListSchema);
module.exports = IngredientList;