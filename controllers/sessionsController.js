const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const User = require("../models/users.js");
const { check, validationResult } = require("express-validator");

router.get("/new", (req, res) => {
    res.render("sessions/new.ejs", {
        currentUser: req.session.currentUser,
        valFat: null,
        valSugar: null,
        valCarbs: null,
        valProtein: null,
        valCalories: null,
    });
});

// on sessions form submit (log in)
router.post(
    "/", [
        check("username", "Please include a username ").notEmpty(),
        check("password", "Password is required").exists(),
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        try {
            let user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ msg: "invalid credentials" });
            }

            const isPasswordMatch = await bcrypt.compareSync(password, user.password);

            if (!isPasswordMatch) {
                return res.status(400).json({ msg: "Invalid Credentials" });
            }

            req.session.currentUser = user;

            res.redirect("/recipies");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

router.delete("/", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/sessions/new");
    });
});

module.exports = router;