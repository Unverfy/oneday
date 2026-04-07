const mongoose = require("mongoose");

const FavoritePlaceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a title for the place"],
    },
    description: {
      type: String,
    },
    location: {
      type: String, // City or coordinates
    },
    image: {
      type: String, // URL to image
    },
    isFavorite: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FavoritePlace", FavoritePlaceSchema);
