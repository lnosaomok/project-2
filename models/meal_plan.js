const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const meal_planSchema = Schema({
    user: { type: String },
    breakfast: { type: mongoose.Schema.Types.Mixed },
    mealDate: { type: String },
    mealDateParsed: { type: String },
    dateWithYear: { type: String },
    lunch: { type: mongoose.Schema.Types.Mixed },
    dinner: { type: mongoose.Schema.Types.Mixed, default: null },
});

const Meal_Plan = mongoose.model("MEAL_PLAN", meal_planSchema);
module.exports = Meal_Plan;