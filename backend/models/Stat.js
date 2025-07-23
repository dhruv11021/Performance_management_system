const mongoose = require("mongoose");

const StatSchema = new mongoose.Schema({
  employees: Number,
  pendingReviews: Number,
  completedGoals: Number,
  avgRating: Number,
});

module.exports = mongoose.model("Stat", StatSchema);
