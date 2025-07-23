import { useState, useEffect } from "react";
import apiService from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function Dashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingReviews, setUpcomingReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsData, activitiesData, reviewsData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getRecentActivities(),
        apiService.getUpcomingReviews(),
      ]);

      setStats(statsData);
      setRecentActivities(activitiesData);
      setUpcomingReviews(reviewsData);
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTimeframe]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <LoadingSpinner size="large" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Performance Dashboard</h2>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="timeframe-select"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Employees</h3>
            <p className="stat-number">{stats?.employees || 0}</p>
            <span className="stat-change positive">+3 this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Pending Reviews</h3>
            <p className="stat-number">{stats?.pendingReviews || 0}</p>
            <span className="stat-change urgent">Due this week</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <h3>Completed Goals</h3>
            <p className="stat-number">{stats?.completedGoals || 0}</p>
            <span className="stat-change positive">+8 this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>Average Rating</h3>
            <p className="stat-number">{stats?.avgRating || 0}/5</p>
            <span className="stat-change positive">+0.3 improvement</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="activity-section">
          <h3>Recent Activities</h3>
          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-avatar">
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="activity-details">
                  <p>
                    <strong>{activity.user}</strong> {activity.action}
                  </p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reviews-section">
          <h3>Upcoming Reviews</h3>
          <div className="reviews-list">
            {upcomingReviews.map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-info">
                  <h4>{review.name}</h4>
                  <p className="review-date">{review.date}</p>
                </div>
                <span className={`review-status ${review.status}`}>
                  {review.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn add-employee" onClick={() => navigate("/employees")}>
            <span className="action-icon">👤</span>
            Add Employee
          </button>
          <button className="action-btn schedule-review" onClick={() => navigate("/employees")}>
            <span className="action-icon">📅</span>
            Schedule Review
          </button>
          <button className="action-btn create-goal" onClick={() => navigate("/employees")}>
            <span className="action-icon">🎯</span>
            Create Goal
          </button>
          <button className="action-btn view-reports" onClick={() => navigate("/employees")}>
            <span className="action-icon">📊</span>
            View Reports
          </button>
        </div>
      </div>

      <div className="performance-chart">
        <h3>Performance Trend</h3>
        <div className="chart-container">
          <div className="chart-bars">
            <div className="chart-month">
              <div className="bar" style={{ height: "60%" }}></div>
              <span>Jan</span>
            </div>
            <div className="chart-month">
              <div className="bar" style={{ height: "75%" }}></div>
              <span>Feb</span>
            </div>
            <div className="chart-month">
              <div className="bar" style={{ height: "80%" }}></div>
              <span>Mar</span>
            </div>
            <div className="chart-month">
              <div className="bar" style={{ height: "85%" }}></div>
              <span>Apr</span>
            </div>
            <div className="chart-month">
              <div className="bar" style={{ height: "90%" }}></div>
              <span>May</span>
            </div>
            <div className="chart-month">
              <div className="bar" style={{ height: "88%" }}></div>
              <span>Jun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
