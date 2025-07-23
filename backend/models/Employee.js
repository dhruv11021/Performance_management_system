const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: String,
  department: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true }); // 👈 Adds createdAt & updatedAt

module.exports = mongoose.model("Employee", EmployeeSchema);
