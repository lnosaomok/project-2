const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    diet_label: { type: String, default: "" },
    macros: [{ type: mongoose.Schema.Types.Mixed }],
    calories: { type: Number, default: "" },
    mealPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "MEAL_PLAN" }],
});
const User = mongoose.model("User", userSchema);
module.exports = User;