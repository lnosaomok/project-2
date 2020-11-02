const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const axios = require("axios");

const User = require("../models/users.js");
router.get("/search", async(req, res) => {
    req.session.search = req.query.search ? req.query.search : req.session.search;
    let query = req.query.search ? req.query.search : req.session.search;

    let url = `https://api.edamam.com/search?q=${query}&app_id=313605df&app_key=3a360d7219529db4accf27b5c25d9845&from=0&to=10`;

    let user = await User.findById("5f9c55d23fd4a051f711dfc8");
    user.macros.forEach((each) => {
        let appendKeys = Object.keys(each)[0];
        let appendValues = Object.values(each)[0];
        url += `&nutrients%5B${appendKeys}%5D=${appendValues}`;
    });

    url += `&health=${user.diet_label}`;

    axios
        .get(url)
        .then(function(response) {
            res.render("recipes/index.ejs", {
                recipes: response.data.hits,
                currentUser: req.session.currentUser,
                val: 10
            });
        })
        .catch(function(error) {
            console.log(error);
        });
});

router.get("/page2", async(req, res) => {
    console.log(req.session.search);
    let url = `https://api.edamam.com/search?q=${req.session.search}&app_id=313605df&app_key=3a360d7219529db4accf27b5c25d9845&from=11&to=20`;

    let user = await User.findById("5f9c55d23fd4a051f711dfc8");
    user.macros.forEach((each) => {
        let appendKeys = Object.keys(each)[0];
        let appendValues = Object.values(each)[0];
        url += `&nutrients%5B${appendKeys}%5D=${appendValues}`;
    });
    url += `&health=${user.diet_label}`;

    axios
        .get(url)
        .then(function(response) {
            res.render("recipes/index2.ejs", {
                recipes: response.data.hits,
                currentUser: req.session.currentUser,
                val: 10
            });
        })
        .catch(function(error) {
            console.log(error);
        });

    console.log(url);
    //const recipies = await
});

router.get("/page3", async(req, res) => {
    let url = `https://api.edamam.com/search?q=${req.session.search}&app_id=313605df&app_key=3a360d7219529db4accf27b5c25d9845&from=21&to=30`;

    let user = await User.findById("5f9c55d23fd4a051f711dfc8");
    user.macros.forEach((each) => {
        let appendKeys = Object.keys(each)[0];
        let appendValues = Object.values(each)[0];
        url += `&nutrients%5B${appendKeys}%5D=${appendValues}`;
    });
    url += `&health=${user.diet_label}`;

    axios
        .get(url)
        .then(function(response) {
            res.render("recipes/index3.ejs", {
                recipes: response.data.hits,
                currentUser: req.session.currentUser,
                val: null
            });
        })
        .catch(function(error) {
            console.log(error);
        });

    console.log(url);
    //const recipies = await
});

router.get("/", async(req, res) => {
    res.render("recipes/index.ejs", {
        recipes: [],
        currentUser: req.session.currentUser,
        val: null

        //const recipies = await
    });
});
/// Create User
// router.post(
//     "/", [
//         check("username", "username is required").not().isEmpty(),
//         check(
//             "password",
//             "Please enter a password with 6 or more characters"
//         ).isLength({ min: 6 }),
//     ],
//     async(req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const { username, password } = req.body;
//         try {
//             let user = await User.findOne({ username });

//             if (user) {
//                 return res.status(400).json({ msg: "User already exists" });
//             }

//             req.body.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//             User.create(req.body, (err, createdUser) => {
//                 req.session.currentUser = createdUser;
//                 res.json(createdUser);
//             });
//         } catch (err) {
//             console.error(err);
//             res.status(500).send("Server Error");
//         }
//     }
// );

// ///Update User Prefrences

// router.post("/userPreferences", async(req, res) => {
//     try {
//         //let user = await User.findById(req.sessions.currentuser.username);

//         // if (!user) return res.status(404).json({ msg: 'User not found' });

//         // make sure user owns preferences

//         await User.findByIdAndUpdate("5f9c55d23fd4a051f711dfc8", {
//             $set: {
//                 diet_labels: req.body.diet_labels,
//             },
//         });
//         await User.findByIdAndUpdate("5f9c55d23fd4a051f711dfc8", {
//             $set: {
//                 macros: req.body.macros,
//             },
//         });
//         await User.findByIdAndUpdate("5f9c55d23fd4a051f711dfc8", {
//             $set: {
//                 calories: req.body.calories,
//             },
//         });
//         res.send("updated");
//         console.log(req.body);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send("Server Error");
//     }
// });
module.exports = router;