const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    location: String,
    country: String,
    image: {
        url: String,
        filename:String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },    category: {
    type: String,
    required: true
},

    // 🔥 THIS MUST BE ObjectId references
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]


});

module.exports = mongoose.model("Listing", listingSchema);
