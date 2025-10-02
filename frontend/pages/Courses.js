import React, { useState } from "react";

export default function CoursesPage() {
  const [userQuestion, setUserQuestion] = useState("");
  const [llmAnswer, setLlmAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!userQuestion.trim()) return;

    try {
      const url = `http://localhost:3000/genai/prompt?message=${encodeURIComponent(userQuestion)}`;
      const response = await fetch(url);
      const data = await response.text(); // LLM returns plain text
      setLlmAnswer(data);
    } catch (err) {
      console.error("Error fetching LLM answer:", err);
      setLlmAnswer("Σφάλμα κατά την κλήση της υπηρεσίας LLM.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Course Chat Assistant</h2>

      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          placeholder="Πληκτρολογήστε την ερώτησή σας..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={handleSubmit} style={{ padding: "8px 16px" }}>
          Ask
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {llmAnswer && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            whiteSpace: "pre-wrap", // preserve line breaks
          }}
        >
          <strong>Answer:</strong>
          <p>{llmAnswer}</p>
        </div>
      )}
    </div>
  );
}
