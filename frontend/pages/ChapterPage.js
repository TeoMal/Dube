import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ChapterPage() {
  const { courseName, chapterName } = useParams();
  const decodedCourse = decodeURIComponent(courseName);
  const decodedChapter = decodeURIComponent(chapterName);
  const navigate = useNavigate();

  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [textContent, setTextContent] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submittedAnswer, setSubmittedAnswer] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [lastMediaType, setLastMediaType] = useState(null);
  const [chapterComplete, setChapterComplete] = useState(false);

  // Fetch questions with steps from backend
  useEffect(() => {
    fetch(
      `http://127.0.0.1:5000/get_questions?course=${encodeURIComponent(
        decodedCourse
      )}&chapter=${encodeURIComponent(decodedChapter)}&user=user1`
    )
      .then((res) => res.json())
      .then((data) => {
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

    if (["reading", "video", "sound"].includes(step.type)) {
      setLastMediaType(step.type);
    }

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
    setSubmittedAnswer(null);
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

  if (chapterComplete) {
    return (
      <div className="container text-center my-5">
        <h2 className="fw-bold" style={{ color: "#4a274f" }}>
          ✅ Chapter Complete!
        </h2>
        <p className="text-muted">
          You have finished the chapter: {decodedChapter}.
        </p>
        <button
          className="btn btn-primary mt-3"
          onClick={() =>
            navigate(`/my-courses/${encodeURIComponent(decodedCourse)}`)
          }
        >
          Finish
        </button>
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

  const handleAnswerSelect = (answer) => {
    if (!submittedAnswer) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    setSubmittedAnswer(selectedAnswer);
    const correct = selectedAnswer === step.correct_answer;

    if (correct) setCorrectCount((prev) => prev + 1);
    else setWrongCount((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const percentage =
        correctCount + wrongCount > 0
          ? correctCount / (correctCount + wrongCount)
          : 1;

      fetch("http://127.0.0.1:5000/mark_chapter_complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: "user1",
          type: lastMediaType,
          percentage: percentage,
          course: decodedCourse,
          chapter: decodedChapter,
        }),
      })
        .then(() => setChapterComplete(true))
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-center mb-4" style={{ color: "#4a274f" }}>
        📖 {decodedChapter}
      </h2>

      <div className="card p-4 mb-3">
        {step.type === "reading" && <p>{textContent}</p>}

        {step.type === "video" && (
          <video src={step.file} controls style={{ width: "100%" }} />
        )}

        {step.type === "image" && (
          <img src={step.file} alt="media" style={{ width: "100%" }} />
        )}

        {step.type === "sound" && (
          <audio src={step.file} controls style={{ width: "100%" }} />
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
                  } ${submittedAnswer ? "disabled" : ""}`}
                  onClick={() => handleAnswerSelect(opt)}
                  disabled={!!submittedAnswer}
                >
                  {opt}
                </button>
              ))}
            </div>
            {selectedAnswer && !submittedAnswer && (
              <button
                className="btn btn-primary mt-3"
                onClick={handleSubmitAnswer}
              >
                Submit Answer
              </button>
            )}
            {submittedAnswer && (
              <div className="mt-3">
                {submittedAnswer === step.correct_answer ? (
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
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={step.type === "question" && !submittedAnswer}
        >
          {currentStep < steps.length - 1 ? "Next" : "Finish Chapter"}
        </button>
      </div>

    </div>
  );
}
