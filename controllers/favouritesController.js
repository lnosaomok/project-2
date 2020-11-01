const express = require("express");
const router = express.Router();
const Favourite = require("../models/favorites");

router.get("/", async(req, res) => {
    let recipies = await Favourite.find({
        user: req.session.currentUser._id,
    });
    res.send(recipies);
});

router.post("/", (req, res) => {
    //res.send(req.body);
    req.body.favourite = JSON.parse(req.body.favourite);
    try {
        Favourite.create(req.body, (err, createdFavourite) => {
            console.log("favourite is created", createdFavourite);
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