const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const User = require("../models/users.js");
router.get("/new", (req, res) => {
    res.render("users/new.ejs", {
        currentUser: req.session.currentUser,
        val: null,
    });
});
router.get("/new2", (req, res) => {
    res.render("users/new2.ejs", {
        currentUser: req.session.currentUser,
        val: null,
    });
});

/// Create User
router.post("/", async(req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }
    const { username, password } = req.body;

    console.log(username, password);
    try {
        // let user = await User.findOne({ username });

        // if (user) {
        //     return res.status(400).json({ msg: "User already exists" });
        // }

        req.body.password = bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10)
        );

        console.log(req.body.password);
        let pass = req.body.password;
        const newUser = new User({
            username,
            password: pass,
        });

        const userSaves = await newUser.save();
        // let createdUser = await User.create({ username, pass });

        req.session.currentUser = userSaves;

        // await console.log(req.session.currentUser);
        //console.log(req.session.currentUser);
        res.redirect("/users/new2");
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

///Update User Prefrences

router.post("/userPreferences", async(req, res) => {
    console.log(req.session);
    let user = await User.findById(req.session.currentUser._id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    try {
        await User.findByIdAndUpdate(req.session.currentUser._id, {
            $set: {
                macrosCarbs: req.body.amounts1,
            },
        });

        await User.findByIdAndUpdate(req.session.currentUser._id, {
            $set: {
                macrosFat: req.body.amounts2,
            },
        });

        await User.findByIdAndUpdate(req.session.currentUser._id, {
            $set: {
                macrosProtein: req.body.amounts3,
            },
        });

        await User.findByIdAndUpdate(req.session.currentUser._id, {
            $set: {
                macrosSugar: req.body.amounts4,
            },
        });

        await User.findByIdAndUpdate(req.session.currentUser._id, {
            $set: {
                diet_label: req.body.diet_label,
            },
        });

        await User.findByIdAndUpdate(req.session.currentUser._id, {
            $set: {
                calories: req.body.calories,
            },
        });
        res.redirect("/recipies");
    } catch (err) {
        console.error("message", err.message);
        res.status(500).send("Server Error");
    }
});
module.exports = router;