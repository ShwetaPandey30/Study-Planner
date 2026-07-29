import { createContext, useState, useEffect, useRef } from "react";
import api from "../services/api";

export const PdfContext = createContext();

export function PdfProvider({ children }) {
  const [file, setFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");
  const [activeType, setActiveType] = useState("");

  const abortControllerRef = useRef(null);

  // Clear PDF states
  const clearPdfState = () => {
    setFile(null);
    setPdfText("");
    setResult("");
    setUploaded(false);
    setLoading(false);
    setError("");
    setActiveType("");
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Upload PDF file
  const uploadPdfFile = async (selectedFile) => {
    if (!selectedFile) {
      setError("Please select a PDF file.");
      return;
    }
    
    setFile(selectedFile);
    setUploaded(false);
    setPdfText("");
    setResult("");
    setError("");
    setActiveType("");
    setLoading(true);

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      const response = await api.post("/api/pdf/upload", formData);
      setPdfText(response.data.text);
      setUploaded(true);
      
      // Update local storage tracking for dashboard counters
      const stats = JSON.parse(localStorage.getItem("aiStudyStats") || '{"uploads":0,"chats":0,"generated":0}');
      stats.uploads = (stats.uploads || 0) + 1;
      localStorage.setItem("aiStudyStats", JSON.stringify(stats));
    } catch (err) {
      console.error(err);
      setError("Failed to upload and extract text from the PDF file. Please try again.");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  // Generate AI study output
  const generateStudyContent = async (selectedType) => {
    if (!pdfText) {
      setError("Upload a PDF file first.");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError("");
    setResult("");
    setActiveType(selectedType);

    try {
      const response = await api.post("/api/pdf/generate", {
        text: pdfText,
        type: selectedType
      }, {
        signal: controller.signal
      });

      setResult(response.data.result);
      
      // Update local storage tracking for dashboard counters
      const stats = JSON.parse(localStorage.getItem("aiStudyStats") || '{"uploads":0,"chats":0,"generated":0}');
      stats.generated = (stats.generated || 0) + 1;
      localStorage.setItem("aiStudyStats", JSON.stringify(stats));

    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") {
        return;
      }
      console.error(err);
      setError("Failed to generate AI study material. Please try again.");
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  };

  const retryGenerate = () => {
    if (activeType) {
      generateStudyContent(activeType);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <PdfContext.Provider
      value={{
        file,
        pdfText,
        result,
        loading,
        uploaded,
        error,
        activeType,
        setError,
        uploadPdf: uploadPdfFile,
        generateStudyContent,
        retryGenerate,
        clearPdfState
      }}
    >
      {children}
    </PdfContext.Provider>
  );
}

export default PdfProvider;
