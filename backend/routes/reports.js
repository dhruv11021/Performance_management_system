const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const Goal = require("../models/Goal");
const Review = require("../models/Review");

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    const goals = await Goal.find();
    const reviews = await Review.find();

    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

    const topPerformers = reviews.filter((r) => r.rating >= 4).length;
    const needsImprovement = reviews.filter((r) => r.rating <= 2).length;

    const goalStats = {
      total: goals.length,
      completed: goals.filter((g) => g.status === "Completed").length,
      inProgress: goals.filter((g) => g.status === "In Progress").length,
      overdue: goals.filter((g) => g.status === "Overdue").length,
    };

    const departmentRatings = {};
    for (const emp of employees) {
      const empReviews = reviews.filter((r) => r.employee === emp.name);
      const avg =
        empReviews.reduce((sum, r) => sum + r.rating, 0) /
        (empReviews.length || 1);

      if (!departmentRatings[emp.department])
        departmentRatings[emp.department] = [];

      departmentRatings[emp.department].push(avg);
    }

    for (const dept in departmentRatings) {
      const ratings = departmentRatings[dept];
      departmentRatings[dept] =
        ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    }

    const reviewStatus = {
      completed: reviews.filter((r) => r.status === "Completed").length,
      pending: reviews.filter((r) => r.status === "Pending").length,
      scheduled: reviews.filter((r) => r.status === "Scheduled").length,
      completionRate:
        Math.round(
          (reviews.filter((r) => r.status === "Completed").length /
            (reviews.length || 1)) *
            100
        ) + "%",
    };

    const performanceDistribution = {
      "0-1": reviews.filter((r) => r.rating <= 1).length,
      "2-3": reviews.filter((r) => r.rating > 1 && r.rating <= 3).length,
      "4-5": reviews.filter((r) => r.rating > 3).length,
    };

    const insights = [
      {
        title: "Top Performer Ratio",
        description: `${topPerformers} employees rated 4+`,
        type: "positive",
      },
      {
        title: "Underperformers",
        description: `${needsImprovement} need improvement`,
        type: "warning",
      },
      {
        title: "Avg Rating",
        description: `Overall: ${averageRating.toFixed(2)}/5`,
        type: "neutral",
      },
    ];

    res.json({
      performanceOverview: {
        average: averageRating.toFixed(2),
        topPerformers,
        needsImprovement,
      },
      goalStats,
      departmentRatings,
      reviewStatus,
      performanceDistribution,
      insights,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating report" });
  }
});

module.exports = router;
