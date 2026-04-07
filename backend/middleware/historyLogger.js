const History = require("../models/History");

/**
 * Utility function to log actions to History
 * Can be used inside controllers.
 */
const logHistory = async (userId, action, metadata = {}) => {
  try {
    await History.create({
      userId,
      action,
      metadata,
    });
  } catch (error) {
    console.error("Failed to log history:", error);
  }
};

module.exports = logHistory;
