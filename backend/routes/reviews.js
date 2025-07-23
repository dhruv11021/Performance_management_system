const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// GET /api/reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST /api/reviews
router.post("/", async (req, res) => {
  const { employee, date, rating, status, comments } = req.body;

  if (!employee || !date || !rating) {
    return res.status(400).json({ error: "Employee, date, and rating are required" });
  }

  try {
    const newReview = new Review({
      employee,
      date,
      rating,
      status,
      comments,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// DELETE /api/reviews/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error("Review update error:", err);
    res.status(500).json({ error: "Failed to update review" });
  }
});

module.exports = router;
