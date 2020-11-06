const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next();
    } else {
        res.redirect("/sessions/new");
    }
};

const User = require("../models/users.js");
router.get("/search", isAuthenticated, async(req, res) => {
            req.session.search = req.query.search ? req.query.search : req.session.search;
            let query = req.query.search ? req.query.search : req.session.search;

            let url = `https://api.edamam.com/search?q=${query}&app_id=${process.env.APP_ID}&app_key=${process.env.APP_KEY}`;

            let user = await User.findById(req.session.currentUser._id);

            if (user.macrosFat !== "") {
                url += `&nutrients%5B${`FAT`}%5D=${user.macrosFat}`;
  }

  if (user.macrosSugar !== "") {
    url += `&nutrients%5B${`SUGAR`}%5D=${user.macrosSugar}`;
  }

  if (user.macrosCarbs !== "") {
    url += `&nutrients%5B${`CHOCDF`}%5D=${user.macrosCarbs}`;
  }

  if (user.macrosProtein !== "") {
    url += `&nutrients%5B${`PROCNT`}%5D=${user.macrosProtein}`;
  }

  if (user.diet_label) {
    url += `&health=${user.diet_label}`;
  }

  axios
    .get(url)
    .then(async function (response) {
      let resp = response.data.hits;
      resp = resp.filter((each) => {
        let recipeLabels = each.recipe.label.toLowerCase();
        query = query.toLowerCase();

        if (recipeLabels.includes(query)) {
          return each;
        }
      });

      let transformedResult = [];
      let transformedResult1 = [];

      await resp.forEach((result) => {
        transformedResult.push(result);
      });
      transformedResult.forEach((result) => {
        let resultObj = {};
        let nutrients = [];
        let {
          FAT,
          CHOCDF,
          SUGAR,
          PROCNT,
          FIBTG,
        } = result.recipe.totalNutrients;
        let {
          label,
          image,
          source,
          url,
          yield,
          ingredientLines,
          ingredients,
          calories,
        } = result.recipe;
        // let { FAT, CHOCDF, SUGAR, PROCNT, FIBTG } = totalNutrients;
        nutrients.push(FAT);
        nutrients.push(CHOCDF);
        nutrients.push(SUGAR);
        nutrients.push(PROCNT);
        nutrients.push(FIBTG);

        resultObj.nutrients = nutrients;
        resultObj.label = label;
        resultObj.image = image;
        resultObj.source = source;
        resultObj.url = url;
        resultObj.yield = yield;
        resultObj.ingredientLines = ingredientLines;
        resultObj.ingredients = ingredients;
        resultObj.calories = calories;

        transformedResult1.push(resultObj);
      });

      res.render("recipes/index.ejs", {
        recipes: transformedResult1,
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
    })
    .catch(function (error) {});
});

router.get("/", isAuthenticated, async (req, res) => {
  res.render("recipes/index.ejs", {
    recipes: [],
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

module.exports = router;