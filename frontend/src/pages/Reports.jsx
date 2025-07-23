import React, { useEffect, useState } from "react";
import apiService from "../services/api";

function Reports() {
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const data = await apiService.getReportData();
        setReportData(data);
      } catch (err) {
        console.error("Failed to load report data", err);
      }
    };
    fetchReportData();
  }, []);

  if (!reportData) return <p>Loading reports...</p>;

  const {
    performanceOverview,
    goalStats,
    departmentRatings,
    reviewStatus,
    performanceDistribution,
    insights,
  } = reportData;

  return (
    <div>
      <h2>Reports & Analytics</h2>

      <div className="reports-grid">
        <div className="report-card">
          <h3>Performance Overview</h3>
          <div className="simple-chart">
            <p>Average Performance: {performanceOverview.average}/5</p>
            <p>Top Performers: {performanceOverview.topPerformers} employees</p>
            <p>Needs Improvement: {performanceOverview.needsImprovement} employees</p>
          </div>
        </div>

        <div className="report-card">
          <h3>Goal Statistics</h3>
          <div className="simple-chart">
            <p>Total Goals: {goalStats.total}</p>
            <p>Completed: {goalStats.completed} ({Math.round((goalStats.completed / goalStats.total) * 100)}%)</p>
            <p>In Progress: {goalStats.inProgress}</p>
            <p>Overdue: {goalStats.overdue}</p>
          </div>
        </div>

        <div className="report-card">
          <h3>Department Performance</h3>
          <div className="simple-chart">
            {Object.entries(departmentRatings).map(([dept, score]) => (
              <p key={dept}>{dept}: {score}/5</p>
            ))}
          </div>
        </div>

        <div className="report-card">
          <h3>Review Status</h3>
          <div className="simple-chart">
            <p>Completed Reviews: {reviewStatus.completed}</p>
            <p>Pending Reviews: {reviewStatus.pending}</p>
            <p>Scheduled Reviews: {reviewStatus.scheduled}</p>
            <p>Completion Rate: {reviewStatus.completionRate}</p>
          </div>
        </div>
      </div>

      <div className="performance-distribution">
        <h3>Performance Distribution</h3>
        <div className="chart-container">
          {Object.entries(performanceDistribution).map(([range, count]) => (
            <div className="chart-item" key={range}>
              <div>{range}</div>
              <div>
                <div
                  style={{
                    width: `${count}%`,
                    height: "20px",
                    background: "#007bff",
                  }}
                ></div>
              </div>
              <div>{count}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="insights-section">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          {insights.map((insight, idx) => (
            <div key={idx} className={`insight-card ${insight.type}`}>
              <h4>{insight.title}</h4>
              <p>{insight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;
