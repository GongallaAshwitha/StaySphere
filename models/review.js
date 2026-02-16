const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);


module.exports = mongoose.model("Review", reviewSchema);
