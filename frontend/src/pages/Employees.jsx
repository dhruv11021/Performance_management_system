import { useState, useEffect } from "react";
import apiService from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Employees fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addEmployee = async (e) => {
    e.preventDefault();

    if (
      !newEmployee.name ||
      !newEmployee.position ||
      !newEmployee.department ||
      !newEmployee.email
    ) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setFormLoading(true);
      const createdEmployee = await apiService.createEmployee(newEmployee);
      setEmployees((prev) => [...prev, createdEmployee]);
      setNewEmployee({ name: "", position: "", department: "", email: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Add employee error:", err);
      alert("Failed to add employee");
    } finally {
      setFormLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await apiService.deleteEmployee(id);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    } catch (err) {
      console.error("Delete employee error:", err);
      alert("Failed to delete employee");
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" />
        <p>Loading employees...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Employee Management</h2>

      <button onClick={() => setShowForm(true)} className="add-btn">
        Add New Employee
      </button>

      <div className="employees-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>{employee.department}</td>
                <td>{employee.email}</td>
                <td>
                  <button className="action-btn edit">Edit</button>
                  <button
                    className="action-btn delete"
                    onClick={() => deleteEmployee(employee._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="form-popup">
          <form onSubmit={addEmployee}>
            <h3>Add New Employee</h3>
            <input
              type="text"
              placeholder="Full Name"
              value={newEmployee.name}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Position"
              value={newEmployee.position}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, position: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={newEmployee.department}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, department: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newEmployee.email}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, email: e.target.value })
              }
              required
            />
            <button type="submit" disabled={formLoading}>
              {formLoading ? "Adding..." : "Add Employee"}
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

export default Employees;
