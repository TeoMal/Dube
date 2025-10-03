import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Profile() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fake static data (name, surname)
  const fullName = "John Papadopoulos"; // optional placeholder
  const email = "giannis@example.com"; // optional placeholder
  const courseEditing = {
    HISTORY: false,
    PHYSICS: true,   // This will be skipped
  };
  useEffect(() => {
    fetch("http://127.0.0.1:5000/get_user_stats?user=user1")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container text-center my-5">
        <p className="text-muted">Could not load profile data.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4" style={{ color: "#4a274f" }}>
        👤 Profile
      </h2>

      {/* User Info Card */}
      <div className="card shadow border-0 mb-4">
        <div className="card-body">
          <h4 className="fw-bold">{fullName}</h4>
          <p className="text-muted mb-1">{email}</p>
          <p className="mb-0">
            Total Questions Answered:{" "}
            <span className="fw-bold">{stats.total_questions_answered}</span>
          </p>
          <p className="mb-0">
            Overall Accuracy:{" "}
            <span className="fw-bold">{stats.accuracy_stats.overall_accuracy}%</span>
          </p>
        </div>
      </div>

      {/* Learning Preferences */}
      <h5 className="fw-bold mb-3" style={{ color: "#4a274f" }}>
        🎯 Learning Preferences
      </h5>
      <div className="row g-4 mb-4">
        {Object.entries(stats.learning_preferences).map(([type, prob]) => (
          <div className="col-md-3" key={type}>
            <div className="card shadow h-100 border-0">
              <div className="card-body text-center">
                <h6 className="fw-bold text-capitalize">{type}</h6>
                <p className="mb-0">{(prob * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Accuracy by Type */}
      <h5 className="fw-bold mb-3" style={{ color: "#4a274f" }}>
        📊 Accuracy by Question Type
      </h5>
      <div className="row g-4 mb-4">
        {Object.entries(stats.accuracy_stats.by_type).map(([type, data]) => (
          <div className="col-md-3" key={type}>
            <div className="card shadow h-100 border-0">
              <div className="card-body text-center">
                <h6 className="fw-bold text-capitalize">{type}</h6>
                <p className="mb-0">Accuracy: {data.accuracy}%</p>
                <p className="mb-0">
                  {data.correct}/{data.total} correct
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Completion */}
      <h5 className="fw-bold mb-3" style={{ color: "#4a274f" }}>
        📚 Course Completion
      </h5>
      <div className="row g-4">
        {Object.entries(stats.course_completion)
          .filter(([key, course]) => !courseEditing[key])   // ✅ filter here
          .map(([key, course], idx) => (
            <div className="col-md-6" key={idx}>
              <div className="card shadow h-100 border-0">
                <div className="card-body">
                  <h6 className="fw-bold">{course.name}</h6>
                  <p className="mb-0">
                    Completed Chapters: {course.completed_chapters.length} /{" "}
                    {course.total_chapters}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
