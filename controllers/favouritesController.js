const express = require("express");
const router = express.Router();
const Favourite = require("../models/favorites");

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next();
    } else {
        res.redirect("/sessions/new");
    }
};

router.get("/:id/:index", async(req, res) => {
    let favRecipes = await Favourite.find({
        user: req.session.currentUser._id,
    });

    let foundFavourite = await Favourite.findById(req.params.id);
    let activeIndex = req.params.index;
    res.render("favourites/show.ejs", {
        element: foundFavourite,
        recipes: favRecipes,
        activeIndex: activeIndex,
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

router.get("/", isAuthenticated, async(req, res) => {
    let favRecipes = await Favourite.find({
        user: req.session.currentUser._id,
    });
    res.render("favourites/index.ejs", {
        element: favRecipes[0],
        recipes: favRecipes,
        activeIndex: 0,
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

router.post("/", async(req, res) => {
    try {
        await Favourite.create(req.body, (err, createdFavourite) => {
            console.log("favourite is created", createdFavourite, err);
        });

        // await console.log(req.session.currentUser);
        //res.redirect("/recipies");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.delete("/", (req, res) => {});

module.exports = router;