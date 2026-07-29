import { useState } from "react";
import "./InteractiveComponents.css";

function InteractiveQuiz({ data }) {
  const { questions } = data;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // null, or number
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]); // Array of user selections
  const [quizComplete, setQuizComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!questions || questions.length === 0) {
    return <p className="error-text">No quiz questions found.</p>;
  }

  const currentQuestion = questions[currentIdx];

  const handleOptionSelect = (optionIdx) => {
    if (selectedOption !== null) return; // Prevent changing answer after selection
    
    setSelectedOption(optionIdx);
    setShowExplanation(true);
    
    const isCorrect = optionIdx === currentQuestion.correctOption;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setAnswers((prev) => [...prev, {
      questionIdx: currentIdx,
      selected: optionIdx,
      correct: currentQuestion.correctOption,
      isCorrect
    }]);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setAnswers([]);
    setQuizComplete(false);
    setShowExplanation(false);
  };

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="quiz-result-card">
        <div className="result-header">
          <span className="result-emoji">{percentage >= 70 ? "🎉" : percentage >= 40 ? "📚" : "✍️"}</span>
          <h2>Quiz Completed!</h2>
          <div className="score-badge">
            Score: <strong>{score}</strong> / {questions.length} ({percentage}%)
          </div>
        </div>

        <div className="result-summary-list">
          <h3>Question Review</h3>
          {questions.map((q, idx) => {
            const userAns = answers.find(a => a.questionIdx === idx);
            return (
              <div key={idx} className={`result-item ${userAns?.isCorrect ? "correct-item" : "incorrect-item"}`}>
                <p className="result-question"><strong>Q{idx + 1}:</strong> {q.question}</p>
                <p className="result-choices">
                  <span>Your Answer: <code className="choice-val">{q.options[userAns?.selected] || "Unanswered"}</code></span>
                  {!userAns?.isCorrect && (
                    <span className="correct-val">Correct Answer: <code>{q.options[q.correctOption]}</code></span>
                  )}
                </p>
                <p className="result-exp"><em>Explanation:</em> {q.explanation}</p>
              </div>
            );
          })}
        </div>

        <button className="reset-quiz-btn" onClick={resetQuiz}>
          Try Quiz Again
        </button>
      </div>
    );
  }

  return (
    <div className="interactive-quiz">
      <div className="quiz-progress-wrapper">
        <span className="progress-text">Question <strong>{currentIdx + 1}</strong> of {questions.length}</span>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="quiz-question">{currentQuestion.question}</h3>

      <div className="quiz-options-list">
        {currentQuestion.options.map((option, idx) => {
          let optionClass = "quiz-option-btn";
          if (selectedOption !== null) {
            if (idx === currentQuestion.correctOption) {
              optionClass += " option-correct";
            } else if (idx === selectedOption) {
              optionClass += " option-incorrect";
            } else {
              optionClass += " option-disabled";
            }
          }

          return (
            <button
              key={idx}
              className={optionClass}
              onClick={() => handleOptionSelect(idx)}
              disabled={selectedOption !== null}
            >
              <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
              <span className="option-text">{option}</span>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="quiz-explanation-box">
          <h4 className="exp-title">
            {selectedOption === currentQuestion.correctOption ? "✅ Correct!" : "❌ Incorrect"}
          </h4>
          <p className="exp-content">{currentQuestion.explanation}</p>
          
          <button className="quiz-next-btn" onClick={handleNext}>
            {currentIdx === questions.length - 1 ? "Finish Quiz" : "Next Question →"}
          </button>
        </div>
      )}
    </div>
  );
}

export default InteractiveQuiz;
