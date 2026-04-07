const express = require("express");
const router = express.Router();
const { getPlaces, setPlace, updatePlace, deletePlace } = require("../controllers/placesController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getPlaces).post(protect, setPlace);
router.route("/:id").put(protect, updatePlace).delete(protect, deletePlace);

module.exports = router;
