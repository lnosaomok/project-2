const express = require("express");
const router = express.Router();
const Favourite = require("../models/favorites");

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
        val: parseInt(req.session.currentUser.macrosFat),
    });
});

router.get("/", async(req, res) => {
    let favRecipes = await Favourite.find({
        user: req.session.currentUser._id,
    });
    res.render("favourites/index.ejs", {
        element: favRecipes[0],
        recipes: favRecipes,
        activeIndex: 0,
        currentUser: req.session.currentUser,
        val: parseInt(req.session.currentUser.macrosFat),
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