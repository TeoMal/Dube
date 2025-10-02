import React, { useState } from "react";

export default function App() {
  const [percentages, setPercentages] = useState({
    algebra: 65,
    geometry: 45,
    calculus: 80,
    statistics: 55
  });
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [locked, setLocked] = useState(false);

  // Mock questions
  const questions = [
    {
      id: 1,
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
      topic: "algebra"
    },
    {
      id: 2,
      text: "What is the area of a circle with radius 5?",
      options: ["25π", "10π", "5π", "15π"],
      correctAnswer: "25π",
      topic: "geometry"
    },
    {
      id: 3,
      text: "What is the derivative of x²?",
      options: ["x", "2x", "x²", "2"],
      correctAnswer: "2x",
      topic: "calculus"
    }
  ];

  const question = questions[currentQuestionIndex];

  const submitAnswer = (answer) => {
    if (locked) return;

    const isCorrect = answer === question.correctAnswer;
    
    if (isCorrect) {
      setMessage("✅ Correct!");
      setPercentages(prev => ({
        ...prev,
        [question.topic]: Math.min(100, prev[question.topic] + 5)
      }));
    } else {
      setMessage(`❌ Wrong! Correct answer was: ${question.correctAnswer}`);
      setPercentages(prev => ({
        ...prev,
        [question.topic]: Math.max(0, prev[question.topic] - 3)
      }));
    }
    
    setLocked(true);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setMessage("");
    setLocked(false);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f0f0f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
    },
    header: {
      backgroundColor: '#4a90e2',
      padding: '20px',
      textAlign: 'center',
      color: 'white'
    },
    headerTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0
    },
    progressContainer: {
      backgroundColor: 'white',
      padding: '20px',
      margin: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    progressItem: {
      margin: '12px 0'
    },
    progressLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '6px'
    },
    topicName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333'
    },
    percentText: {
      fontSize: '12px',
      color: '#666'
    },
    progressBarBg: {
      height: '20px',
      backgroundColor: '#e0e0e0',
      borderRadius: '10px',
      overflow: 'hidden'
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#4a90e2',
      borderRadius: '10px',
      transition: 'width 0.3s ease'
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px'
    },
    questionCard: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '600px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px'
    },
    questionText: {
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '24px',
      color: '#333'
    },
    optionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    optionButton: {
      backgroundColor: '#f5f5f5',
      padding: '15px 20px',
      borderRadius: '8px',
      border: '2px solid #ddd',
      fontSize: '16px',
      color: '#333',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'left'
    },
    optionButtonHover: {
      backgroundColor: '#e8e8e8',
      borderColor: '#4a90e2'
    },
    correctOption: {
      backgroundColor: '#d4edda',
      borderColor: '#28a745'
    },
    disabledOption: {
      cursor: 'not-allowed',
      opacity: 0.7
    },
    message: {
      fontSize: '18px',
      margin: '20px 0',
      fontWeight: 'bold',
      padding: '12px 24px',
      borderRadius: '8px',
      backgroundColor: 'white'
    },
    nextButton: {
      backgroundColor: '#4a90e2',
      color: 'white',
      padding: '12px 30px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease'
    },
    footer: {
      backgroundColor: '#333',
      padding: '15px',
      textAlign: 'center',
      color: 'white'
    },
    footerText: {
      fontSize: '12px',
      margin: 0
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Math Learning App</h1>
      </header>

      {/* Progress Bars */}
      <div style={styles.progressContainer}>
        {Object.entries(percentages).map(([topic, percent]) => (
          <div key={topic} style={styles.progressItem}>
            <div style={styles.progressLabel}>
              <span style={styles.topicName}>
                {topic.charAt(0).toUpperCase() + topic.slice(1)}
              </span>
              <span style={styles.percentText}>{percent}%</span>
            </div>
            <div style={styles.progressBarBg}>
              <div style={{...styles.progressBarFill, width: `${percent}%`}} />
            </div>
          </div>
        ))}
      </div>

      {/* Question Card */}
      <main style={styles.content}>
        {question ? (
          <div style={styles.questionCard}>
            <h2 style={styles.questionText}>{question.text}</h2>
            <div style={styles.optionsContainer}>
              {question.options.map((option, index) => (
                <button
                  key={index}
                  style={{
                    ...styles.optionButton,
                    ...(locked && option === question.correctAnswer ? styles.correctOption : {}),
                    ...(locked ? styles.disabledOption : {})
                  }}
                  onClick={() => submitAnswer(option)}
                  disabled={locked}
                  onMouseEnter={(e) => {
                    if (!locked) {
                      e.target.style.backgroundColor = '#e8e8e8';
                      e.target.style.borderColor = '#4a90e2';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!locked) {
                      e.target.style.backgroundColor = '#f5f5f5';
                      e.target.style.borderColor = '#ddd';
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p>Loading question...</p>
        )}
        
        {message && <div style={styles.message}>{message}</div>}
        
        <button 
          style={styles.nextButton}
          onClick={nextQuestion}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#357abd'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4a90e2'}
        >
          Next Question
        </button>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 Math Learning</p>
      </footer>
    </div>
  );
}