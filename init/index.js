const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
require("dotenv").config();

const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAP_TOKEN,
});

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});

    const listings = [];

    for (let obj of initData.data) {
        const response = await geocodingClient
            .forwardGeocode({
                query: `${obj.location}, ${obj.country}`,
                limit: 1,
            })
            .send();

        obj.owner = "6a4d6a69851339b6cb95fa3a";
        obj.geometry = response.body.features[0].geometry;

        listings.push(obj);
    }

    await Listing.insertMany(listings);

    console.log("Data was initialized");
    mongoose.connection.close();
};

initDB();