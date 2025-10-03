import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ChapterPage() {
  const { courseName, chapterName } = useParams();
  const decodedCourse = decodeURIComponent(courseName);
  const decodedChapter = decodeURIComponent(chapterName);

  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [textContent, setTextContent] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Fetch questions with all steps from backend
  useEffect(() => {
    fetch(
      `http://127.0.0.1:5000/get_questions?course=${encodeURIComponent(
        decodedCourse
      )}&chapter=${encodeURIComponent(decodedChapter)}`
    )
      .then((res) => res.json())
      .then((data) => {
        // Flatten all steps from all questions
        const allSteps = data.flatMap((q) =>
          q.steps.map((step) => ({ ...step, questionId: q.id }))
        );
        setSteps(allSteps);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });
  }, [decodedCourse, decodedChapter]);

  // Load reading text when current step is reading
  useEffect(() => {
    if (!steps.length) return;

    const step = steps[currentStep];
    if (step.type === "reading") {
      fetch(step.file)
        .then((res) => res.text())
        .then(setTextContent)
        .catch((err) => {
          console.error("Error fetching text:", err);
          setTextContent("Error loading content.");
        });
    } else {
      setTextContent("");
    }
    setSelectedAnswer(null);
  }, [currentStep, steps]);

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!steps.length) {
    return (
      <div className="container text-center my-5">
        <p className="text-muted">No content available for this chapter.</p>
      </div>
    );
  }

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
  };

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-center mb-4" style={{ color: "#4a274f" }}>
        📖 {decodedChapter}
      </h2>

      <div className="card p-4 mb-3">
        {step.type === "reading" && (
          <div>
            <h5>Reading</h5>
            <p>{textContent}</p>
          </div>
        )}

        {step.type === "video" && (
          <div>
            <h5>Video</h5>
            <video
              src={step.file}
              controls
              style={{ width: "100%", maxHeight: "500px" }}
            />
          </div>
        )}

        {step.type === "image" && (
          <div>
            <h5>Image</h5>
            <img
              src={step.file}
              alt="Chapter media"
              style={{ width: "100%", maxHeight: "500px" }}
            />
          </div>
        )}

        {step.type === "question" && (
          <div>
            <h5 className="mb-3">{step.question}</h5>
            <div className="list-group">
              {step.answers.map((opt, idx) => (
                <button
                  key={idx}
                  className={`list-group-item list-group-item-action ${
                    selectedAnswer === opt ? "active" : ""
                  }`}
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {selectedAnswer && (
              <div className="mt-3">
                {selectedAnswer === step.correct_answer ? (
                  <div className="alert alert-success">Correct!</div>
                ) : (
                  <div className="alert alert-danger">
                    Wrong! Correct answer: {step.correct_answer}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-end">
        {currentStep < steps.length - 1 ? (
          <button className="btn btn-primary" onClick={handleNext}>
            Next
          </button>
        ) : (
          <div className="text-center text-success fw-bold">
            ✅ End of chapter!
          </div>
        )}
      </div>
    </div>
  );
}
