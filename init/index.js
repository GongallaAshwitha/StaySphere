const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listings");

const MONGO_URL = "mongodb://127.0.0.1:27017/StaySphere";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    // Delete old data
    await Listing.deleteMany({});

    // Add owner field to every listing
    const updatedData = initData.data.map((obj) => ({
      ...obj,
      owner: new mongoose.Types.ObjectId("698ed419804feda88d31543a")
    }));

    // Insert new data
    await Listing.insertMany(updatedData);

    console.log("Data initialized successfully!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.connection.close();
  }
}

main();
