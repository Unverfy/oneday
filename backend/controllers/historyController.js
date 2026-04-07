const History = require("../models/History");

// @desc    Get user history
// @route   GET /api/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const historyLog = await History.find({ userId: req.user.id })
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await History.countDocuments({ userId: req.user.id });

    res.status(200).json({
      data: historyLog,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getHistory,
};
