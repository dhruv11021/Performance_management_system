import { useState, useEffect } from "react";
import apiService from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    employee: "",
    status: "Pending",
    description: "",
    deadline: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [goalsData, employeesData] = await Promise.all([
        apiService.getGoals(),
        apiService.getEmployees(),
      ]);
      setGoals(goalsData);
      setEmployees(employeesData);
      console.log("Employees fetched:", employeesData); // 👈 for debugging
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addGoal = async (e) => {
    e.preventDefault();

    if (!newGoal.title || !newGoal.employee) {
      alert("Please fill in required fields");
      return;
    }

    try {
      setFormLoading(true);
      const createdGoal = await apiService.createGoal(newGoal);
      setGoals((prev) => [...prev, createdGoal]);
      setNewGoal({
        title: "",
        employee: "",
        status: "Pending",
        description: "",
        deadline: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Add goal error:", err);
      alert("Failed to add goal");
    } finally {
      setFormLoading(false);
    }
  };

  const updateGoalStatus = async (id, newStatus) => {
    try {
      await apiService.updateGoal(id, { status: newStatus });
      setGoals((prev) =>
        prev.map((goal) =>
          goal._id === id ? { ...goal, status: newStatus } : goal
        )
      );
    } catch (err) {
      console.error("Update goal error:", err);
    }
  };

  const deleteGoal = async (id) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      await apiService.deleteGoal(id);
      setGoals((prev) => prev.filter((goal) => goal._id !== id));
    } catch (err) {
      console.error("Delete goal error:", err);
      alert("Failed to delete goal");
    }
  };

  const getEmployeeName = (identifier) => {
    const emp = employees.find((e) => e._id === identifier || e.name === identifier);
    return emp ? emp.name : identifier;
  };

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" />
        <p>Loading goals...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Goals Management</h2>

      <button onClick={() => setShowForm(true)} className="add-btn">
        Add New Goal
      </button>

      <div className="goals-list">
        <h3>All Goals ({goals.length})</h3>
        {goals.map((goal) => (
          <div key={goal._id} className="goal-item">
            <div className="goal-header">
              <h4>{goal.title}</h4>
              <select
                value={goal.status}
                onChange={(e) => updateGoalStatus(goal._id, e.target.value)}
                className="status-select"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <p>Employee: {getEmployeeName(goal.employee)}</p>
            {goal.description && <p>Description: {goal.description}</p>}
            {goal.deadline && <p>Deadline: {goal.deadline}</p>}
            <button className="delete-btn" onClick={() => deleteGoal(goal._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="form-popup">
          <form onSubmit={addGoal}>
            <h3>Add New Goal</h3>
            <input
              type="text"
              placeholder="Goal Title *"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
              required
            />

            <select
              value={newGoal.employee}
              onChange={(e) =>
                setNewGoal({ ...newGoal, employee: e.target.value })
              }
              required
            >
              <option value="">Select Employee *</option>
              {employees.map((emp) => (
                <option key={emp._id || emp.id} value={emp._id || emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={newGoal.description}
              onChange={(e) =>
                setNewGoal({ ...newGoal, description: e.target.value })
              }
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) =>
                setNewGoal({ ...newGoal, deadline: e.target.value })
              }
            />
            <select
              value={newGoal.status}
              onChange={(e) =>
                setNewGoal({ ...newGoal, status: e.target.value })
              }
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button type="submit" disabled={formLoading}>
              {formLoading ? "Adding..." : "Add Goal"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={formLoading}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Goals;
