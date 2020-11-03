const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const meal_planSchema = Schema({
    breakfast:{name}
});
const Meal_Plan = mongoose.model("MEAL_PLAN", meal_planSchema);
module.exports = Meal_Plan;