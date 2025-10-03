import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ChapterPage() {
  const { courseName, chapterName } = useParams();
  const decodedCourse = decodeURIComponent(courseName);
  const decodedChapter = decodeURIComponent(chapterName);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/get_questions?course=${encodeURIComponent(decodedCourse)}&chapter=${encodeURIComponent(decodedChapter)}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });
  }, [decodedCourse, decodedChapter]);

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="container text-center my-5">
        <p className="text-muted">No questions available for this chapter.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-center mb-4" style={{ color: "#4a274f" }}>
        📖 {decodedChapter} – Questions
      </h2>

      <div className="list-group">
        {questions.map((q, idx) => (
          <div key={idx} className="list-group-item list-group-item-action">
            <h6 className="fw-bold">Q{idx + 1}: {q.question}</h6>
            {q.options && (
              <ul className="mt-2">
                {q.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
