const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g., "created plan", "added place", "login"
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Storing JSON metadata
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", HistorySchema);
