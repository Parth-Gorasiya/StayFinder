const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

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
    default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
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
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User",
  },
  geometry :{
    type : {
      type : String,
      enum : ["Point"], //location.type must be "Point"
      required : true,
    },
    coordinates : {
    type : [Number],
    required : true,

  }

  
  },
});

listingSchema.post("findOneAnddelete", async(listing) =>{
  if(listing){
    await Review.deleteMany({_id: { $in : listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;