import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CourseParticipant() {
  const { courseName } = useParams();
  const decodedName = decodeURIComponent(courseName);

  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/get_chapters?course=${encodeURIComponent(decodedName)}`)
      .then(res => res.json())
      .then(data => {
        setChapters(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching chapters:", err);
        setLoading(false);
      });
  }, [decodedName]);

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="container text-center my-5">
        <p className="text-muted">No chapters available.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-4" style={{ color: "#4a274f" }}>
        📚 {decodedName}
      </h2>

      <p className="text-muted text-center mb-5">
        Explore the chapters of this course. Click on a chapter to view its questions.
      </p>

      <div className="row g-4">
        {chapters.map((chapter, idx) => (
          <div className="col-md-4" key={idx}>
            <Link
              to={`/my-courses/${encodeURIComponent(decodedName)}/${encodeURIComponent(chapter.name)}`}
              className="text-decoration-none"
            >
              <div className="card shadow h-100 border-0">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{chapter.name}</h5>
                  <p className="card-text">{chapter.description}</p>
                  <p className="text-muted mb-0">
                    Completed: {chapter.completed ? "Yes ✅" : "No ❌"}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
