import { useState } from "react";
import "./InteractiveComponents.css";

function InteractiveFlashcards({ data }) {
  const { flashcards } = data;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return <p className="error-text">No flashcards found.</p>;
  }

  const activeCard = flashcards[currentIdx];

  const handleNext = () => {
    setFlipped(false);
    // Add brief timeout for flip transition before changing card text
    setTimeout(() => {
      setCurrentIdx((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
    }, 150);
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
    }, 150);
  };

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  return (
    <div className="interactive-flashcards">
      <div className="flashcards-progress">
        <span>Flashcard <strong>{currentIdx + 1}</strong> of {flashcards.length}</span>
      </div>

      <div className="flashcard-container" onClick={handleFlip}>
        <div className={`flashcard ${flipped ? "flipped" : ""}`}>
          <div className="flashcard-front">
            <div className="card-side-label">QUESTION</div>
            <p className="card-content">{activeCard.front}</p>
            <div className="click-hint">Click to Reveal Answer ↩</div>
          </div>
          <div className="flashcard-back">
            <div className="card-side-label">ANSWER</div>
            <p className="card-content">{activeCard.back}</p>
            <div className="click-hint">Click to Flip Back ↩</div>
          </div>
        </div>
      </div>

      <div className="flashcards-controls">
        <button className="control-btn" onClick={handlePrev}>
          ← Previous
        </button>
        <button className="flip-action-btn" onClick={handleFlip}>
          🔄 Flip Card
        </button>
        <button className="control-btn" onClick={handleNext}>
          Next →
        </button>
      </div>
    </div>
  );
}

export default InteractiveFlashcards;
