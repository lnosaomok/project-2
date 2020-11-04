const express = require("express");
const router = express.Router();
const User = require("../models/users.js");

router.get("/:id", async(req, res) => {
    let user = await User.findById(req.session.currentUser._id);
    console.log("user", user);
    let foundMealPlan = user.mealPlans.filter((plan) => {
        return plan._id == req.params.id;
    });

    res.render("mealplans/show.ejs", {
        currentUser: req.session.currentUser,
        val: 0,
        mealPlan: foundMealPlan[0],
    });
});

router.get("/", async(req, res) => {
    let user = await User.findById(req.session.currentUser._id);
    userMealPlan = user.mealPlans;
    let sortedDateMealPlans = userMealPlan.sort(
        (a, b) => parseFloat(b.mealDateParsed) - parseFloat(a.mealDateParsed)
    );

    res.render("mealplans/index.ejs", {
        currentUser: req.session.currentUser,
        val: 0,
        mealPlans: sortedDateMealPlans,
    });
});

router.post("/", async(req, res) => {
    //console.log(req.body);

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
        };

        console.log(mealPlan);
        let user = await User.findById(req.session.currentUser._id);

        const dateExists = user.mealPlans.some((element) => {
            return element.mealDate === mealDate;
        });

        const dateExistsId = user.mealPlans.filter((element) => {
            return element.mealDate === mealDate;
        });

        console.log(dateExistsId);
        // const dateAndMealTimeExists = user.mealPlans.some((element) => {
        //     return element.mealDate === mealDate && element.mealTime === mealTime;
        // });

        /// if date does not already exist at all, create the new one.

        if (!dateExists) {
            await User.findByIdAndUpdate(req.session.currentUser._id, {
                $push: {
                    mealPlans: mealPlan,
                },
            });
            res.redirect(
                `/favourites/${req.body.favouriteIndex}/${req.body.activeIndex}`
            );
        }
        // else if (!dateAndMealTimeExists) {
        //     await User.findByIdAndUpdate(req.session.currentUser._id, {
        //         $push: {
        //             mealPlans: mealPlan,
        //         },
        //     });
        // }
        else {
            //console.log(dateExistsId);
            // res.status(400).send("Meal Time Already has an entry");
            if (mealTime === "breakfast") {
                await User.update({
                    _id: req.session.currentUser._id,
                    "mealPlans._id": dateExistsId,
                }, { $set: { "mealPlans.$.breakfast": mealValue } });
            }

            if (mealTime === "lunch") {
                await User.update({
                    _id: req.session.currentUser._id,
                    "mealPlans._id": dateExistsId,
                }, { $set: { "mealPlans.$.lunch": mealValue } });
            }

            if (mealTime === "dinner") {
                await User.update({
                    _id: req.session.currentUser._id,
                    "mealPlans._id": dateExistsId,
                }, { $set: { "mealPlans.$.dinner": mealValue } });
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

router.delete("/", (req, res) => {});

module.exports = router;