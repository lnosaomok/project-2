const express = require("express");
const router = express.Router();
const Meal_Plan = require("../models/meal_plan");
const IngredientsList = require("../models/ingredientsLists");

router.post("/", async(req, res) => {
    let ids = req.body;
    const arr = [];
    for (const key in ids) {
        arr.push(ids[`${key}`]);
    }

    let records = await Meal_Plan.find().where("_id").in(arr);
    let arrayOfIngredients = [];
    let mealDates = [];
    records.forEach((record, index, arr) => {
        if (
            record.breakfast !== "" &&
            record.breakfast.ingredientLines.length > 0
        ) {
            record.breakfast.ingredientLines.forEach((ingrItem) => {
                arrayOfIngredients.push(`${ingrItem} (Breakfast) `);
            });
        }

        if (record.lunch !== "" && record.lunch.ingredientLines.length > 0) {
            record.lunch.ingredientLines.forEach((ingrItem) => {
                arrayOfIngredients.push(`${ingrItem} (Lunch) `);
            });
        }

        if (record.dinner !== "" && record.dinner.ingredientLines.length > 0) {
            record.dinner.ingredientLines.forEach((ingrItem) => {
                arrayOfIngredients.push(`${ingrItem} (Dinner) `);
            });
        }

        mealDates.push(record.mealDate);
    });

    let obj = {};
    obj.name = mealDates;
    obj.ingredientsList = arrayOfIngredients;
    obj.user = req.session.currentUser._id;

    let list = await IngredientsList.create(obj);
    res.send(list);
});

router.get("/:id", async(req, res) => {
    let list = await IngredientsList.findById(req.params.id);
    res.render("ingredientLists/show.ejs", {
        list,
        currentUser: req.session.currentUser,
        valFat: req.session.currentUser.macrosFat !== "" ?
            parseInt(req.session.currentUser.macrosFat) :
            0,
        valSugar: req.session.currentUser.macrosSugar !== "" ?
            parseInt(req.session.currentUser.macrosSugar) :
            0,
        valCarbs: req.session.currentUser.macrosCarbs !== "" ?
            parseInt(req.session.currentUser.macrosCarbs) :
            0,
        valProtein: req.session.currentUser.macrosProtein !== "" ?
            parseInt(req.session.currentUser.macrosProtein) :
            0,
        valCalories: req.session.currentUser.calories !== null ?
            req.session.currentUser.calories :
            0,
    });
});

router.get("/", async(req, res) => {
    let lists = await IngredientsList.find({
        user: req.session.currentUser._id,
    });

    res.render("ingredientLists/index.ejs", {
        lists,
        currentUser: req.session.currentUser,
        valFat: req.session.currentUser.macrosFat !== "" ?
            parseInt(req.session.currentUser.macrosFat) :
            0,
        valSugar: req.session.currentUser.macrosSugar !== "" ?
            parseInt(req.session.currentUser.macrosSugar) :
            0,
        valCarbs: req.session.currentUser.macrosCarbs !== "" ?
            parseInt(req.session.currentUser.macrosCarbs) :
            0,
        valProtein: req.session.currentUser.macrosProtein !== "" ?
            parseInt(req.session.currentUser.macrosProtein) :
            0,
        valCalories: req.session.currentUser.calories !== null ?
            req.session.currentUser.calories :
            0,
    });
});

router.delete("/:id", (req, res) => {
    IngredientsList.findByIdAndDelete(req.params.id, () => {
        res.redirect("/ingredients");
    });
});

module.exports = router;