const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const Review = require("../models/Review");
const Goal = require("../models/Goal");

// GET /api/dashboard/stats
router.get("/stats", async (req, res) => {
  try {
    const employeesCount = await Employee.countDocuments();

    const pendingReviewsCount = await Review.countDocuments({ status: "Pending" });

    const completedGoalsCount = await Goal.countDocuments({ status: "Completed" });

    const avgRatingAgg = await Review.aggregate([
      { $match: { rating: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);

    const avgRating = avgRatingAgg.length > 0 ? avgRatingAgg[0].avgRating.toFixed(1) : 0;

    res.json({
      employees: employeesCount,
      pendingReviews: pendingReviewsCount,
      completedGoals: completedGoalsCount,
      avgRating: parseFloat(avgRating),
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// New: GET /api/dashboard/activities (Dynamic from multiple collections)
router.get("/activities", async (req, res) => {
  try {
    const [recentEmployees, recentGoals, recentReviews] = await Promise.all([
      Employee.find().sort({ updatedAt: -1 }).limit(5).lean(),
      Goal.find().sort({ updatedAt: -1 }).limit(5).lean(),
      Review.find().sort({ updatedAt: -1 }).limit(5).lean(),
    ]);

    const formatActivity = (type, doc) => ({
  type,
  user:
    type === "Goal"
      ? doc.title // Show goal title instead of employee ID
      : doc.name || doc.employee || "Unknown",
  action: `updated a ${type.toLowerCase()}`,
  time: doc.updatedAt || doc.createdAt,
});


    const allActivities = [
      ...recentEmployees.map((doc) => formatActivity("Employee", doc)),
      ...recentGoals.map((doc) => formatActivity("Goal", doc)),
      ...recentReviews.map((doc) => formatActivity("Review", doc)),
    ];

    const sorted = allActivities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);

    res.json(sorted);
  } catch (err) {
    console.error("Activity fetch error:", err);
    res.status(500).json({ error: "Failed to fetch recent activities" });
  }
});

// GET /api/dashboard/upcoming-reviews
router.get("/upcoming-reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ status: "Scheduled" })
      .sort({ date: 1 })
      .limit(5);

    const formatted = reviews.map((r) => ({
      employee: r.employee,  // <-- use r.employee (name or ID stored)
      date: new Date(r.date).toLocaleDateString(),
      status: r.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Dashboard upcoming-reviews error:", err);
    res.status(500).json({ error: "Failed to fetch upcoming reviews" });
  }
});

module.exports = router;
