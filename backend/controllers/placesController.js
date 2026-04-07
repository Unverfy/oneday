const FavoritePlace = require("../models/FavoritePlace");
const logHistory = require("../middleware/historyLogger");

// @desc    Get places
// @route   GET /api/places
// @access  Private
const getPlaces = async (req, res) => {
  try {
    const places = await FavoritePlace.find({ userId: req.user.id });
    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Set place
// @route   POST /api/places
// @access  Private
const setPlace = async (req, res) => {
  try {
    const { title, description, location, image, isFavorite } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Please add a title field" });
    }

    const place = await FavoritePlace.create({
      title,
      description,
      location,
      image,
      isFavorite,
      userId: req.user.id,
    });

    await logHistory(req.user.id, "Added a new favorite place", { placeId: place._id, title });

    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update place
// @route   PUT /api/places/:id
// @access  Private
const updatePlace = async (req, res) => {
  try {
    const place = await FavoritePlace.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // Check for user
    if (place.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedPlace = await FavoritePlace.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await logHistory(req.user.id, "Updated favorite place", { placeId: updatedPlace._id });

    res.status(200).json(updatedPlace);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete place
// @route   DELETE /api/places/:id
// @access  Private
const deletePlace = async (req, res) => {
  try {
    const place = await FavoritePlace.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // Check for user
    if (place.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await place.deleteOne();

    await logHistory(req.user.id, "Deleted a place", { placeId: req.params.id });

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getPlaces,
  setPlace,
  updatePlace,
  deletePlace,
};
