const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const meal_planSchema = Schema({
    breakfast: { type: mongoose.Schema.Types.Mixed },
    mealDate: { type: String },
    mealDateParsed: { type: String },
    dateWithYear: { type: String },
    lunch: { type: mongoose.Schema.Types.Mixed },
    dinner: { type: mongoose.Schema.Types.Mixed, default: null },
});
const userSchema = Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    diet_label: { type: String, default: "" },
    macrosFat: { type: String, default: "" },
    macrosCarbs: { type: String, default: "" },
    macrosProtein: { type: String, default: "" },
    macrosSugar: { type: String, default: "" },
    calories: { type: Number, default: "" },
    mealPlans: [{ type: meal_planSchema }],
});
const User = mongoose.model("User", userSchema);
module.exports = User;