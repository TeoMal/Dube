import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import studentsData from "./students.json";

export default function CourseEditor() {
  const { courseName } = useParams();
  const decodedName = decodeURIComponent(courseName);

  const [chapters, setChapters] = useState([]);
  const [students, setStudents] = useState(studentsData);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null); // For popup

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

    // Remove student (for demo purposes only)

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
    <div className="container my-4">
      <h2 className="mb-3 text-center">Editing Course: {decodedName}</h2>
      <div className="row">
        {/* Left: Students list */}
        <div className="col-md-4 mb-3">
          <h4>Enrolled Students</h4>
          <ul className="list-group">
            {students.map(student => (
              <li
                key={student.id}
                className="list-group-item d-flex flex-column align-items-start"
              >
                <div className="d-flex justify-content-between w-100">
                  <strong>{student.name}</strong>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => removeStudent(student.id)}
                  >
                    Remove
                  </button>
                </div>

                {/* Probabilities as progress bars */}
                <div className="w-100 mt-2">
                  <div className="mb-1">Text ({student.probabilities.text}%)</div>
                  <div className="progress mb-2" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{ width: `${student.probabilities.text}%` }}
                    ></div>
                  </div>

                  <div className="mb-1">Video ({student.probabilities.video}%)</div>
                  <div className="progress mb-2" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${student.probabilities.video}%` }}
                    ></div>
                  </div>

                  <div className="mb-1">Sound ({student.probabilities.sound}%)</div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{ width: `${student.probabilities.sound}%` }}
                    ></div>
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
          <div className="row justify-content-center">
            {chapters.map((chapter, idx) => (
              <div className="col-md-12 mb-3" key={idx}>
                <div
                  className="card shadow border-0 h-100 cursor-pointer"
                  onClick={() => setSelectedChapter(chapter)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body bg-secondary text-white rounded d-flex flex-column align-items-center">
                    <h5 className="card-title">{chapter.name}</h5>
                    <p className="card-text text-center">{chapter.description}</p>
                    <p className="mt-auto">
                      Completed: {chapter.completed ? "Yes" : "No"}
                    </p>
                    <div className="fw-bold text-end w-100">→</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ----- Popup Modal ----- */}
      {selectedChapter && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedChapter(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedChapter.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedChapter(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{selectedChapter.description}</p>
                <p>Questions completed: {selectedChapter.questions_completed}</p>
                <p>Questions correct: {selectedChapter.questions_correct}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedChapter(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
