const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  employee: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comments: String,
  status: {
    type: String,
    enum: ["Completed", "Scheduled", "Pending"],
    default: "Completed",
  },
}, { timestamps: true }); // 👈 This line adds createdAt & updatedAt

module.exports = mongoose.model("Review", ReviewSchema);
