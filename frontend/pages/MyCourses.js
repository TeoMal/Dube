import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/get_courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
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

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4" style={{ color: "#4a274f" }}>
        My Courses
      </h2>

      <div className="row g-4">
        {courses.map((course, idx) => (
          <div className="col-md-4" key={idx}>
            <Link
              to={`/my-courses/${encodeURIComponent(course.name)}`}
              className="text-decoration-none"
            >
              <div className="card shadow h-100 border-0">
                <div className="card-body d-flex flex-column">
                  <div className="mb-2">
                    {course.editing === "true" ? (
                      <span className="badge bg-warning text-dark">Editor</span>
                    ) : (
                      <span className="badge bg-secondary text-white">Participant</span>
                    )}
                  </div>

                  {course.logo_url && (
                    <img
                      src={course.logo_url}
                      alt={course.name}
                      className="img-fluid mb-3"
                      style={{ maxHeight: "150px", objectFit: "cover", borderRadius: "8px" }}
                    />
                  )}

                  <h5 className="card-title fw-bold">{course.name}</h5>

                  <p className="card-text text-muted flex-grow-1">{course.description}</p>

                  {course.total_chapters != null && course.chapters_completed != null && (
                    <p className="mt-2 mb-0">
                      Completion: {course.chapters_completed}/{course.total_chapters}
                    </p>
                  )}

                  <div className="fw-bold text-end mt-auto">→</div>
                </div>
              </div>
            </Link>
          </div>
        ))}

        {/* Add a Course Card (always displayed) */}
        <div className="col-md-4">
          <Link to="/add-course" className="text-decoration-none">
            <div className="card shadow h-100 border-0 d-flex align-items-center justify-content-center">
              <div className="card-body d-flex flex-column align-items-center justify-content-center">
                <div
                  className="d-flex align-items-center justify-content-center mb-3"
                  style={{
                    fontSize: "3rem",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: "2px dashed #4a274f",
                    color: "#4a274f",
                  }}
                >
                  +
                </div>
                <h5 className="card-title fw-bold text-center">Add a Course</h5>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
