const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const favouritesSchema = Schema({
    favourite: { type: mongoose.Schema.Types.Mixed },
    user: { type: String },
});
const favourites = mongoose.model("FAVOURITES", favouritesSchema);
module.exports = favourites;