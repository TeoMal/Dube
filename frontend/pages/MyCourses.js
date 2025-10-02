import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all courses
  useEffect(() => {
    fetch("http://127.0.0.1:5000/get_courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data); // expected: array of { name, description, image }
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

  if (courses.length === 0) {
    return (
      <div className="container text-center my-5">
        <p className="text-muted">No courses available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container text-center my-4">
      <h2 className="mb-3">Available Courses</h2>


      <div className="row justify-content-center">
        {courses.map((course, idx) => (
          <div className="col-md-5 mb-3" key={idx}>
            <Link
              to={`/my-courses/${encodeURIComponent(course)}`}
              className="text-decoration-none"
            >
              <div className="card shadow border-0 h-100">
                <div className="card-body bg-primary text-white rounded d-flex flex-column align-items-center">
                  <h5 className="card-title">{course.name}</h5>
                  {course.logo_url && (
                    <img
                      src={course.logo_url}
                      alt={course.name}
                      className="img-fluid my-2"
                      style={{ maxHeight: "150px", objectFit: "cover" }}
                    />
                  )}
                  <p className="card-text text-center">{course.description}</p>
                  {/* Display completion as fraction */}
                  {course.total_chapters != null && course.chapters_completed != null && (
                    <p className="mt-auto">
                      Completion: {course.chapters_completed}/{course.total_chapters}
                    </p>
                  )}
                  <div className="fw-bold text-end w-100">→</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
