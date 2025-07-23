const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");

// GET /api/employees
router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// POST /api/employees
router.post("/", async (req, res) => {
  const { name, position, department, email } = req.body;

  if (!name || !position || !department || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newEmployee = new Employee({ name, position, department, email });
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    res.status(500).json({ error: "Failed to add employee" });
  }
});

// DELETE /api/employees/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

module.exports = router;