const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");

// GET /api/goals
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

// POST /api/goals
router.post("/", async (req, res) => {
  const { title, employee, status, description, deadline } = req.body;

  if (!title || !employee) {
    return res.status(400).json({ error: "Title and employee are required" });
  }

  try {
    const newGoal = new Goal({ title, employee, status, description, deadline });
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(500).json({ error: "Failed to add goal" });
  }
});

// PUT /api/goals/:id
router.put("/:id", async (req, res) => {
  const { status } = req.body;

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ error: "Failed to update goal status" });
  }
});

// DELETE /api/goals/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
    if (!deletedGoal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    res.json({ message: "Goal deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete goal" });
  }
});

module.exports = router;
