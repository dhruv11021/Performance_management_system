const API_BASE_URL = "http://localhost:5000/api";

const apiService = {
  // Employees
  async getEmployees() {
    const res = await fetch(`${API_BASE_URL}/employees`);
    if (!res.ok) throw new Error("Failed to fetch employees");
    return res.json();
  },

  async createEmployee(employee) {
    const res = await fetch(`${API_BASE_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    if (!res.ok) throw new Error("Failed to create employee");
    return res.json();
  },

  async deleteEmployee(id) {
    const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete employee");
  },

  // Goals
  async getGoals() {
    const res = await fetch(`${API_BASE_URL}/goals`);
    if (!res.ok) throw new Error("Failed to fetch goals");
    return res.json();
  },

  async createGoal(goal) {
    const res = await fetch(`${API_BASE_URL}/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(goal),
    });
    if (!res.ok) throw new Error("Failed to create goal");
    return res.json();
  },

  async updateGoal(id, updatedFields) {
    const res = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    if (!res.ok) throw new Error("Failed to update goal");
    return res.json();
  },

  async deleteGoal(id) {
    const res = await fetch(`${API_BASE_URL}/goals/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete goal");
  },

  // Reports
  async getReportData() {
  const res = await fetch(`${API_BASE_URL}/reports`);
  if (!res.ok) throw new Error("Failed to fetch report data");
  return res.json();
},

  // Reviews
  async getReviews() {
    const res = await fetch(`${API_BASE_URL}/reviews`);
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return res.json();
  },

  async createReview(review) {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });
    if (!res.ok) throw new Error("Failed to submit review");
    return res.json();
  },

  async deleteReview(id) {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete review");
  },
  // Dashboard
async getDashboardStats() {
  const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
},

async getRecentActivities() {
  const res = await fetch(`${API_BASE_URL}/dashboard/activities`);
  if (!res.ok) throw new Error("Failed to fetch recent activities");
  return res.json();
},

async getUpcomingReviews() {
  const res = await fetch(`${API_BASE_URL}/dashboard/upcoming-reviews`);
  if (!res.ok) throw new Error("Failed to fetch upcoming reviews");
  return res.json();
},
updateReview: async (id, reviewData) => {
    const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
    if (!res.ok) throw new Error("Failed to update review");
    return await res.json();
  },
};

export default apiService;
