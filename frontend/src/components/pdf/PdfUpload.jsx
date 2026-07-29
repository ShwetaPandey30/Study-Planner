import { useContext, useState } from "react";
import { PdfContext } from "../../context/PdfContext";
import "./PdfUpload.css";

import StudyActions from "./StudyActions";
import StudyOutput from "./StudyOutput";

function PdfUpload() {
  const {
    file,
    loading,
    uploaded,
    result,
    error,
    activeType,
    uploadPdf,
    clearPdfState,
    generateStudyContent,
    retryGenerate
  } = useContext(PdfContext);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const fileObj = e.target.files[0];
      setSelectedFile(fileObj);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      return;
    }
    uploadPdf(selectedFile);
  };

  const handleClear = () => {
    setSelectedFile(null);
    clearPdfState();
    // Reset file input value
    const input = document.getElementById("pdf-file-input");
    if (input) input.value = "";
  };

  return (
    <div className="page">
      <h1 className="title">📚 AI Study Assistant</h1>

      <p className="subtitle">
        Upload your study material and generate AI-powered summaries, notes, flashcards, quizzes, interview questions, or ask the explainer.
      </p>

      {/* Error display banner */}
      {error && (
        <div className="error-banner">
          <div className="error-message-content">
            <span className="error-icon">⚠️</span>
            <p className="error-text">{error}</p>
          </div>
          <div className="error-actions">
            {activeType && (
              <button className="retry-btn" onClick={retryGenerate}>
                Retry Generation
              </button>
            )}
            <button className="dismiss-btn" onClick={handleClear}>
              Clear & Reset
            </button>
          </div>
        </div>
      )}

      {/* Upload card container */}
      <div className="upload-card">
        <div className="file-input-container">
          <input
            id="pdf-file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>

        <div className="upload-actions-container">
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={loading || !selectedFile}
          >
            {loading && !uploaded ? "Extracting Text..." : "Upload PDF"}
          </button>

          {(uploaded || selectedFile) && (
            <button
              className="clear-btn"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Uploaded File Info */}
      {uploaded && (
        <>
          <div className="file-info">
            <div className="file-info-details">
              <span className="file-icon-display">📄</span>
              <div>
                <h3>{file?.name}</h3>
                <p className="success">✅ File extracted successfully. Ready for AI.</p>
              </div>
            </div>
          </div>

          <StudyActions
            loading={loading}
            onGenerate={generateStudyContent}
          />
        </>
      )}

      {/* Output section */}
      <StudyOutput 
        result={result} 
        loading={loading} 
        activeType={activeType} 
        onRetry={retryGenerate} 
      />
    </div>
  );
}

export default PdfUpload;