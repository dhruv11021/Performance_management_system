const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  employee: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  description: String,
  deadline: String,
}, { timestamps: true }); // 👈 Adds createdAt & updatedAt

module.exports = mongoose.model("Goal", GoalSchema);
