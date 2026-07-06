const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
  filename: {
    type: String,
    default: "listingimage",
  },
  url: {
    type: String,
    default: "https://unsplash.com/photos/silhouette-photography-of-coconut-palm-trees-CSs8aiN_LkI",
  },
},
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type: Schema.Types.ObjectId,
      ref : "Review",

    }
  ]
});

listingSchema.post("findOneAnddelete", async(listing) =>{
  if(listing){
    await Review.deleteMany({_id: { $in : listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;