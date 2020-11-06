const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next();
    } else {
        res.redirect("/sessions/new");
    }
};

const User = require("../models/users.js");
router.get("/edit", isAuthenticated, async(req, res) => {
    let user = await User.findById(req.session.currentUser._id);
    res.render("users/edit.ejs", {
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

router.get("/new", (req, res) => {
    res.render("users/new.ejs", {
        currentUser: req.session.currentUser,
        valFat: null,
        valSugar: null,
        valCarbs: null,
        valProtein: null,
        valCalories: null,
    });
});
router.get("/new2", (req, res) => {
    res.render("users/new2.ejs", {
        currentUser: req.session.currentUser,
        valFat: null,
        valSugar: null,
        valCarbs: null,
        valProtein: null,
        valCalories: null,
    });
});

/// Create User
router.post(
    "/", [
        check("username", "name is required").not().isEmpty(),
        check(
            "username",
            "Please enter a username with 6 or more characters"
        ).isLength({ min: 6 }),
        check(
            "password",
            "Please enter a password with 6 or more characters"
        ).isLength({ min: 6 }),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username });

            if (user) {
                return res.status(400).json({ msg: "User already exists" });
            }

            req.body.password = bcrypt.hashSync(
                req.body.password,
                bcrypt.genSaltSync(10)
            );

            let pass = req.body.password;
            const newUser = new User({
                username,
                password: pass,
            });

            const userSaves = await newUser.save();
            // let createdUser = await User.create({ username, pass });

            req.session.currentUser = userSaves;

            res.redirect("/users/new2");
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    }
);

///Update User Prefrences

router.post("/userPreferences", async(req, res) => {
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
        let userAfterSave = await User.findById(req.session.currentUser._id);
        req.session.currentUser = userAfterSave;
        res.redirect("/favourites");
    } catch (err) {
        console.error("message", err.message);
        res.status(500).send("Server Error");
    }
});
module.exports = router;