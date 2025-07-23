import { useState, useEffect } from "react";
import apiService from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [status, setStatus] = useState("Scheduled");
  const [rating, setRating] = useState(1);
  const [comments, setComments] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const [reviewsData, employeesData] = await Promise.all([
        apiService.getReviews(),
        apiService.getEmployees(),
      ]);
      setReviews(reviewsData);
      setEmployees(employeesData);
    } catch (err) {
      console.error("Reviews fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const openEditForm = (review) => {
    setIsEditing(true);
    setEditingReview(review);
    setSelectedEmployee(review.employee);
    setStatus(review.status);
    setRating(review.rating);
    setComments(review.comments);
    setShowForm(true);
  };

  const resetForm = () => {
    setSelectedEmployee("");
    setStatus("Scheduled");
    setRating(1);
    setComments("");
    setEditingReview(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }

    try {
      setFormLoading(true);

      const reviewData = {
        employee: selectedEmployee,
        date: new Date().toISOString().split("T")[0],
        status,
        rating,
        comments,
      };

      if (isEditing) {
        const updated = await apiService.updateReview(editingReview._id, reviewData);
        setReviews((prev) =>
          prev.map((r) => (r._id === updated._id ? updated : r))
        );
      } else {
        const created = await apiService.createReview(reviewData);
        setReviews((prev) => [...prev, created]);
      }

      resetForm();
    } catch (err) {
      console.error("Submit review error:", err);
      alert("Failed to submit review");
    } finally {
      setFormLoading(false);
    }
  };

  const deleteReview = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await apiService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Delete review error:", err);
      alert("Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <LoadingSpinner size="large" />
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Performance Reviews</h2>

      <button onClick={() => setShowForm(true)} className="add-btn">
        Add New Review
      </button>

      <div className="reviews-list">
        <h3>All Reviews ({reviews.length})</h3>
        {reviews.map((review) => (
          <div key={review._id} className="review-item">
            <div className="review-header">
              <h4>{review.employee}</h4>
              <span className={`status-badge ${review.status.toLowerCase()}`}>
                {review.status}
              </span>
            </div>
            <p>Date: {review.date}</p>
            {review.rating > 0 && <p>Rating: {review.rating}/5</p>}
            {review.comments && <p>Comments: {review.comments}</p>}

            <button onClick={() => openEditForm(review)} className="edit-btn">
              Edit
            </button>
            <button
              className="delete-btn"
              onClick={() => deleteReview(review._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="form-popup">
          <form onSubmit={submitReview}>
            <h3>{isEditing ? "Edit Review" : "Performance Review"}</h3>

            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>

            <label>Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>

            <label>Rating (1–5):</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>

            <label>Comments:</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter review comments..."
            />

            <button type="submit" disabled={formLoading}>
              {formLoading
                ? isEditing
                  ? "Updating..."
                  : "Submitting..."
                : isEditing
                ? "Update Review"
                : "Submit Review"}
            </button>

            <button type="button" onClick={resetForm} disabled={formLoading}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Reviews;
