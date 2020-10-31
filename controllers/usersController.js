const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const User = require("../models/users.js");
router.get("/new", (req, res) => {
    res.render("users/new.ejs", { currentUser: req.session.currentUser });
});
router.get("/new2", (req, res) => {
    res.render("users/new2.ejs", { currentUser: req.session.currentUser });
});

/// Create User
router.post(
    "/", [
        check("username", "username is required").not().isEmpty(),
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

            req.body.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            await User.create(req.body, (err, createdUser) => {
                console.log("user is created", createdUser);
                // req.session.currentUser = "createdUser";
            });

            // await console.log(req.session.currentUser);
            res.redirect("/sessions/new");
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    }
);

///Update User Prefrences

router.post("/userPreferences", async(req, res) => {
    macros = [];
    let macros1 = {};
    let macros2 = {};
    let macros3 = {};
    let macros4 = {};
    if (req.body.amounts[0] !== "") {
        macros1["CHOCDF"] = req.body.amounts[0];
        macros.push(macros1);
    }
    if (req.body.amounts[1] !== "") {
        macros2["FAT"] = req.body.amounts[1];
        macros.push(macros2);
    }
    if (req.body.amounts[2] !== "") {
        macros3["PROCNT"] = req.body.amounts[2];
        macros.push(macros3);
    }
    if (req.body.amounts[3] !== "") {
        macros4["SUGAR"] = req.body.amounts[3];
        macros.push(macros4);
    }

    req.body.macros = macros;
    console.log(req.session);
    try {
        //let user = await User.findById(req.sessions.currentuser.username);

        // if (!user) return res.status(404).json({ msg: 'User not found' });

        // make sure user owns preferences

        await User.findByIdAndUpdate(req.session.currentUser._id, {
            $set: {
                diet_label: req.body.diet_label,
            },
        });
        await User.findByIdAndUpdate(req.session.currentUser._id, {
            $set: {
                macros: req.body.macros,
            },
        });
        await User.findByIdAndUpdate(req.session.currentUser._id, {
            $set: {
                calories: req.body.calories,
            },
        });
        res.redirect("/recipies");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
module.exports = router;