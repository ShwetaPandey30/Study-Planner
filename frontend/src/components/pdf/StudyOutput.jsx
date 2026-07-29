import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";
import InteractiveQuiz from "./InteractiveQuiz";
import InteractiveFlashcards from "./InteractiveFlashcards";
import "./InteractiveComponents.css";

function StudyOutput({ result, loading, activeType }) {
  const [parsedData, setParsedData] = useState(null);
  const [parseError, setParseError] = useState(false);

  useEffect(() => {
    if (!result) {
      setParsedData(null);
      setParseError(false);
      return;
    }

    if (activeType === "quiz" || activeType === "flashcards") {
      try {
        // Strip code block markers if LLM wrapped JSON in ```json ```
        let cleanResult = result.trim();
        if (cleanResult.startsWith("```json")) {
          cleanResult = cleanResult.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (cleanResult.startsWith("```")) {
          cleanResult = cleanResult.replace(/^```/, "").replace(/```$/, "").trim();
        }

        const data = JSON.parse(cleanResult);
        setParsedData(data);
        setParseError(false);
      } catch (err) {
        console.error("Failed to parse structured JSON response:", err);
        setParsedData(null);
        setParseError(true);
      }
    } else {
      setParsedData(null);
      setParseError(false);
    }
  }, [result, activeType]);

  // Loading skeleton shimmer effect
  if (loading) {
    return (
      <div className="output-card">
        <h2>🤖 AI Assistant is Generating...</h2>
        <div className="shimmer-container">
          <div className="shimmer-line title"></div>
          <div className="shimmer-line paragraph"></div>
          <div className="shimmer-line paragraph"></div>
          <div className="shimmer-line paragraph-short"></div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="output-card">
      <h2>
        {activeType === "quiz" ? "❓ Quiz" : activeType === "flashcards" ? "🃏 Flashcards" : "🤖 Study Resource"}
      </h2>

      {/* Render parsed interactive items */}
      {activeType === "quiz" && parsedData && !parseError && (
        <InteractiveQuiz data={parsedData} />
      )}

      {activeType === "flashcards" && parsedData && !parseError && (
        <InteractiveFlashcards data={parsedData} />
      )}

      {/* Fallback to raw markdown if parsing failed, or if it's text type */}
      {((activeType !== "quiz" && activeType !== "flashcards") || parseError) && (
        <>
          {parseError && (
            <div className="error-banner" style={{ margin: "0 0 20px 0", padding: "10px 16px" }}>
              <span className="error-text" style={{ fontSize: "13px" }}>
                ⚠️ The model did not output structured JSON. Falling back to plain text display.
              </span>
            </div>
          )}
          
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {result}
          </ReactMarkdown>
        </>
      )}
    </div>
  );
}

export default StudyOutput;