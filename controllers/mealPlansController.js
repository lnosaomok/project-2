const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const Meal_Plan = require("../models/meal_plan");

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next();
  } else {
    res.redirect("/sessions/new");
  }
};

router.get("/:id/edit", async (req, res) => {
  Meal_Plan.findById(req.params.id, (error, mealplan) => {
    res.render("mealplans/edit.ejs", {
      mealplan,
      currentUser: req.session.currentUser,
      valFat:
        req.session.currentUser.macrosFat !== ""
          ? parseInt(req.session.currentUser.macrosFat)
          : 0,
      valSugar:
        req.session.currentUser.macrosSugar !== ""
          ? parseInt(req.session.currentUser.macrosSugar)
          : 0,
      valCarbs:
        req.session.currentUser.macrosCarbs !== ""
          ? parseInt(req.session.currentUser.macrosCarbs)
          : 0,
      valProtein:
        req.session.currentUser.macrosProtein !== ""
          ? parseInt(req.session.currentUser.macrosProtein)
          : 0,
      valCalories:
        req.session.currentUser.calories !== null
          ? req.session.currentUser.calories
          : 0,
    });
  });
});

router.get("/new", isAuthenticated, async (req, res) => {
  res.render("mealplans/new.ejs", {
    currentUser: req.session.currentUser,
    valFat:
      req.session.currentUser.macrosFat !== ""
        ? parseInt(req.session.currentUser.macrosFat)
        : 0,
    valSugar:
      req.session.currentUser.macrosSugar !== ""
        ? parseInt(req.session.currentUser.macrosSugar)
        : 0,
    valCarbs:
      req.session.currentUser.macrosCarbs !== ""
        ? parseInt(req.session.currentUser.macrosCarbs)
        : 0,
    valProtein:
      req.session.currentUser.macrosProtein !== ""
        ? parseInt(req.session.currentUser.macrosProtein)
        : 0,
    valCalories:
      req.session.currentUser.calories !== null
        ? req.session.currentUser.calories
        : 0,
  });
});

router.get("/:id", async (req, res) => {
  let foundMealPlan = await Meal_Plan.findById(req.params.id);

  res.render("mealplans/show.ejs", {
    currentUser: req.session.currentUser,
    valFat:
      req.session.currentUser.macrosFat !== ""
        ? parseInt(req.session.currentUser.macrosFat)
        : 0,
    valSugar:
      req.session.currentUser.macrosSugar !== ""
        ? parseInt(req.session.currentUser.macrosSugar)
        : 0,
    valCarbs:
      req.session.currentUser.macrosCarbs !== ""
        ? parseInt(req.session.currentUser.macrosCarbs)
        : 0,
    valProtein:
      req.session.currentUser.macrosProtein !== ""
        ? parseInt(req.session.currentUser.macrosProtein)
        : 0,
    valCalories:
      req.session.currentUser.calories !== null
        ? req.session.currentUser.calories
        : 0,
    mealPlan: foundMealPlan,
  });
});

router.get("/", isAuthenticated, async (req, res) => {
  let meal_plans = await Meal_Plan.find({
    user: req.session.currentUser._id,
  });

  userMealPlan = meal_plans;
  let sortedDateMealPlans = userMealPlan.sort(
    (a, b) => parseFloat(b.mealDateParsed) - parseFloat(a.mealDateParsed)
  );

  res.render("mealplans/index.ejs", {
    currentUser: req.session.currentUser,
    valFat:
      req.session.currentUser.macrosFat !== ""
        ? parseInt(req.session.currentUser.macrosFat)
        : 0,
    valSugar:
      req.session.currentUser.macrosSugar !== ""
        ? parseInt(req.session.currentUser.macrosSugar)
        : 0,
    valCarbs:
      req.session.currentUser.macrosCarbs !== ""
        ? parseInt(req.session.currentUser.macrosCarbs)
        : 0,
    valProtein:
      req.session.currentUser.macrosProtein !== ""
        ? parseInt(req.session.currentUser.macrosProtein)
        : 0,
    valCalories:
      req.session.currentUser.calories !== null
        ? req.session.currentUser.calories
        : 0,
    mealPlans: sortedDateMealPlans,
  });
});
router.post("/new", async (req, res) => {
  let {
    date_mealPlan,
    breakfastFoodName,
    breakfastIngredients,
    breakfastInstructions,
    lunchFoodName,
    lunchIngredients,
    lunchInstructions,
    dinnerFoodName,
    dinnerIngredients,
    dinnerInstructions,
    includeBreakfast,
    includeLunch,
    includeDinner,
  } = req.body;

  let dateWithYear = date_mealPlan + "/" + new Date().getFullYear();
  dateWithYear = new Date(`${dateWithYear}`).toDateString();
  let mealDateParsed = date_mealPlan.replace("/", "");
  if (
    includeBreakfast &&
    includeBreakfast === "on" &&
    (breakfastFoodName === "" ||
      breakfastInstructions === "" ||
      breakfastIngredients === "")
  ) {
    res.send("fill out all the breakfast fields or disable breakfast");
  } else if (
    includeLunch &&
    includeLunch === "on" &&
    (lunchFoodName === "" ||
      lunchInstructions === "" ||
      lunchIngredients === "")
  ) {
    res.send("fill out all the lunch fields or disable lunch");
  } else if (
    includeDinner &&
    includeDinner === "on" &&
    (dinnerFoodName === "" ||
      dinnerInstructions === "" ||
      dinnerIngredients === "")
  ) {
    res.send("fill out all the dinner fields or disable dinner");
  } else {
    let meal_planDateExists = await Meal_Plan.findOne({
      mealDate: date_mealPlan,
      user: req.session.currentUser._id,
    });
    if (!meal_planDateExists) {
      let breakfast = {};
      let lunch = {};
      let dinner = {};

      if (includeBreakfast && includeBreakfast === "on") {
        breakfast.label = breakfastFoodName;
        breakfast.ingredientLines = breakfastIngredients.split(",");
        breakfast.url = breakfastInstructions;
      } else {
        breakfast = "";
      }

      if (includeLunch && includeLunch === "on") {
        lunch.label = lunchFoodName;
        lunch.ingredientLines = lunchIngredients.split(",");
        lunch.url = lunchInstructions;
      } else {
        lunch = "";
      }

      if (includeDinner && includeDinner === "on") {
        dinner.label = dinnerFoodName;
        dinner.ingredientLines = dinnerIngredients.split(",");
        dinner.url = dinnerInstructions;
      } else {
        dinner = "";
      }

      let mealPlan = {
        mealDate: date_mealPlan,
        mealDateParsed,
        breakfast,
        lunch,
        dinner,
        dateWithYear,
        user: req.session.currentUser._id,
      };

      await Meal_Plan.create(mealPlan);
      res.redirect(`/mealplan`);
    } else {
      res.send(
        "entries already exist for this date. You probably want to edit instead of creating a new mealplan"
      );
    }
  }
});

router.put("/:id", async (req, res) => {
  let {
    date_mealPlan,
    breakfastFoodName,
    breakfastIngredients,
    breakfastInstructions,
    lunchFoodName,
    lunchIngredients,
    lunchInstructions,
    dinnerFoodName,
    dinnerIngredients,
    dinnerInstructions,
    includeBreakfast,
    includeLunch,
    includeDinner,
  } = req.body;

  let dateWithYear = date_mealPlan + "/" + new Date().getFullYear();
  dateWithYear = new Date(`${dateWithYear}`).toDateString();
  let mealDateParsed = date_mealPlan.replace("/", "");
  if (
    includeBreakfast &&
    includeBreakfast === "on" &&
    (breakfastFoodName === "" ||
      breakfastInstructions === "" ||
      breakfastIngredients === "")
  ) {
    res.send("fill out all the breakfast fields or disable breakfast");
  } else if (
    includeLunch &&
    includeLunch === "on" &&
    (lunchFoodName === "" ||
      lunchInstructions === "" ||
      lunchIngredients === "")
  ) {
    res.send("fill out all the lunch fields or disable lunch");
  } else if (
    includeDinner &&
    includeDinner === "on" &&
    (dinnerFoodName === "" ||
      dinnerInstructions === "" ||
      dinnerIngredients === "")
  ) {
    res.send("fill out all the dinner fields or disable dinner");
  } else {
    let breakfast = {};
    let lunch = {};
    let dinner = {};

    if (includeBreakfast && includeBreakfast === "on") {
      breakfast.label = breakfastFoodName;
      breakfast.ingredientLines = breakfastIngredients.split(",");
      breakfast.url = breakfastInstructions;
    } else {
      breakfast = "";
    }

    if (includeLunch && includeLunch === "on") {
      lunch.label = lunchFoodName;
      lunch.ingredientLines = lunchIngredients.split(",");
      lunch.url = lunchInstructions;
    } else {
      lunch = "";
    }

    if (includeDinner && includeDinner === "on") {
      dinner.label = dinnerFoodName;
      dinner.ingredientLines = dinnerIngredients.split(",");
      dinner.url = dinnerInstructions;
    } else {
      dinner = "";
    }

    let mealPlan = {
      mealDate: date_mealPlan,
      mealDateParsed,
      breakfast,
      lunch,
      dinner,
      dateWithYear,
      user: req.session.currentUser._id,
    };

    await Meal_Plan.findByIdAndUpdate(req.params.id, mealPlan, (error) => {});

    res.redirect("/mealplan");
  }
});

router.post("/", async (req, res) => {
  try {
    let { mealDate, mealTime, mealValue } = req.body;
    let dateWithYear = mealDate + "/" + new Date().getFullYear();
    dateWithYear = new Date(`${dateWithYear}`).toDateString();
    let mealDateParsed = mealDate.replace("/", "");
    mealValue = JSON.parse(mealValue);

    let mealPlan = {
      mealDate,
      mealDateParsed,
      breakfast: mealTime === "breakfast" ? mealValue : "",
      lunch: mealTime === "lunch" ? mealValue : "",
      dinner: mealTime === "dinner" ? mealValue : "",
      dateWithYear,
      user: req.session.currentUser._id,
    };

    let meal_planDateExists = await Meal_Plan.findOne({
      mealDate,
      user: req.session.currentUser._id,
    });

    if (!meal_planDateExists) {
      await Meal_Plan.create(mealPlan);
      res.redirect(
        `/favourites/${req.body.favouriteIndex}/${req.body.activeIndex}`
      );
    } else {
      if (mealTime === "breakfast") {
        await Meal_Plan.updateOne(
          {
            mealDate: meal_planDateExists.mealDate,
            user: req.session.currentUser._id,
          },
          { $set: { breakfast: mealValue } }
        );
      }

      if (mealTime === "lunch") {
        await Meal_Plan.updateOne(
          {
            mealDate: meal_planDateExists.mealDate,
            user: req.session.currentUser._id,
          },
          { $set: { lunch: mealValue } }
        );
      }

      if (mealTime === "dinner") {
        await Meal_Plan.updateOne(
          {
            mealDate: meal_planDateExists.mealDate,
            user: req.session.currentUser._id,
          },
          { $set: { dinner: mealValue } }
        );
      }
      res.redirect(
        `/favourites/${req.body.favouriteIndex}/${req.body.activeIndex}`
      );
    }
  } catch (err) {
    console.error("message", err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", (req, res) => {
  Meal_Plan.findByIdAndDelete(req.params.id, () => {
    res.redirect("/mealplan");
  });
});

module.exports = router;
