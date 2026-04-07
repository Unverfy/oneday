const User = require("../models/User");
const Setting = require("../models/Setting");
const logHistory = require("../middleware/historyLogger");

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const settings = await Setting.findOne({ userId: req.user.id });

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/update-profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { username, theme, notificationsEnabled } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) {
      user.username = username;
      await user.save();
    }

    let settings = await Setting.findOne({ userId: req.user.id });
    if (theme || notificationsEnabled !== undefined) {
      if (theme) settings.theme = theme;
      if (notificationsEnabled !== undefined) settings.notificationsEnabled = notificationsEnabled;
      await settings.save();
    }

    await logHistory(req.user.id, "Updated profile context or settings");

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getMe,
  updateProfile,
};
