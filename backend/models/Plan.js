const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a plan title"],
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: [true, "Please provide a date for the plan"],
    },
    status: {
      type: String,
      enum: ["planned", "completed", "canceled"],
      default: "planned",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", PlanSchema);
