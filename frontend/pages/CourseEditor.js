import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import studentsData from "./students.json";

export default function CourseEditor() {
  const { courseName } = useParams();
  const decodedName = decodeURIComponent(courseName);

  const [chapters, setChapters] = useState([]);
  const [students, setStudents] = useState(studentsData);
  const [loading, setLoading] = useState(true);

  // Fetch chapters
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

  const removeStudent = (id) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

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
        {decodedName} - Chapters
      </h2>

      <div className="row">
        {/* Left: Students List */}
        <div className="col-md-4 mb-4">
          <h4>Enrolled Students</h4>
          <ul className="list-group">
            {students.map(student => (
              <li key={student.id} className="list-group-item d-flex flex-column align-items-start">
                <div className="d-flex justify-content-between w-100">
                  <strong>{student.name}</strong>
                  <button className="btn btn-sm btn-danger" onClick={() => removeStudent(student.id)}>
                    Remove
                  </button>
                </div>
                <div className="w-100 mt-2">
                  <div className="mb-1">Text ({student.probabilities.text}%)</div>
                  <div className="progress mb-2" style={{ height: "8px" }}>
                    <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${student.probabilities.text}%` }}></div>
                  </div>

                  <div className="mb-1">Video ({student.probabilities.video}%)</div>
                  <div className="progress mb-2" style={{ height: "8px" }}>
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: `${student.probabilities.video}%` }}></div>
                  </div>

                  <div className="mb-1">Sound ({student.probabilities.sound}%)</div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${student.probabilities.sound}%` }}></div>
                  </div>
                </div>
              </li>
            ))}
            {students.length === 0 && (
              <li className="list-group-item text-muted">No students enrolled</li>
            )}
          </ul>
        </div>

        {/* Right: Chapters */}
        <div className="col-md-8">
          <div className="row g-4">
            {chapters.map((chapter, idx) => (
              <div className="col-md-6" key={idx}>
                <Link
                  to={`/My-courses/${encodeURIComponent(decodedName)}/${encodeURIComponent(chapter.name)}`}
                  className="text-decoration-none"
                >
                  <div className="card shadow h-100 border-0">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title fw-bold">{chapter.name}</h5>
                      <p className="card-text text-muted flex-grow-1">{chapter.description}</p>
                      {/* <p className="mt-2 mb-0">
                        Completed: {chapter.completed ? "Yes" : "No"}
                      </p> */}
                      <div className="fw-bold text-end fs-3">→</div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {/* Add Chapter Card */}
            <div className="col-md-6">
              <Link
                to={`/My-courses/${encodeURIComponent(decodedName)}/add-chapter`}
                className="text-decoration-none"
              >
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
                    <h5 className="card-title fw-bold text-center">Add Chapter</h5>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
