# AI Study Assistant (Production Refactored)

An advanced, interactive React + Node.js AI Study Assistant designed to transform static study materials (PDFs) into structured learning modules, featuring automated quizzes, flashcards, conceptual explication, and standard study logs.

---

## 🚀 Key Features Implemented

1. **AI-Structured JSON Generation**:
   * Leveraging the new **Gemini SDK Structured Outputs** (`responseMimeType: "application/json"`) with JSON Schema verification.
   * Guarantees exact schemas for quizzes and flashcards without prompt leakage.
2. **Interactive UI Widgets**:
   * **Interactive Quizzes**: Multiple-choice testing, step progress tracking, immediate option-select styling feedback (correct/incorrect), answer review panels, and visual score analytics.
   * **Interactive Flashcards**: 3D flip card animations (using pure CSS perspective transformations) and slide controls.
3. **Robust Layout Grid**:
   * Removed duplicated sidebar layout bugs in top navbar.
   * Implemented custom fluid layouts responsive down to mobile viewports with collapsible sidebar navigation.
4. **Reliability & State Persistence**:
   * Persisted PDF analysis, raw text, loading states, and output components using a React `PdfContext` interface. Users can safely navigate routes without losing their progress.
   * Added `AbortController` cancellation to eliminate race conditions.
   * Safe initialization: local storage JSON parsing is secured inside `try-catch` structures.
5. **Production Backend Safeguards**:
   * Resolved file pointer leaks: uploaded files are deleted inside a `finally` block, ensuring no orphan files consume disk space upon text extraction failures.
   * Correct routing: restored "Interview Questions" and "Explain Difficult Topics" buttons to use dedicated system prompts.
6. **Analytics Dashboard**:
   * Dynamic dashboard that calculates learning metrics (PDFs uploaded, chat logs sent, and generated materials) from live state logs.

---

## 🛠️ Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A [Gemini API Key](https://ai.google.dev/)

### Step 1: Set up the Backend
1. Open a terminal and navigate to the `/backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `/backend` directory:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Start the backend server:
   * **Development Mode (Nodemon)**: `npm run dev`
   * **Production Mode**: `npm start`

### Step 2: Set up the Frontend
1. Open a new terminal and navigate to the `/frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Launch the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 🤖 AI Usage Details

This application utilizes the official Google Gen AI SDK (`@google/genai`) to interface with `gemini-2.5-flash`.
* **Standard Prompting (Markdown Fallback)**: For unstructured responses (summaries, detailed notes, interview prep, and explainer blocks), the model is instructed to output readable GitHub Flavored Markdown.
* **Structured Output Schema Enforcement**: For quizzes and flashcards, the backend enforces JSON responses matching a strict configuration:
  * **Quiz Schema**: Enforces an object containing a list of `questions`, where each item includes a `question` string, exactly 4 option strings, a `correctOption` index, and a string `explanation`.
  * **Flashcards Schema**: Enforces an array of object pairs containing `front` (term/question) and `back` (definition/answer).

---

## ⏱️ Time Spent Log & Known Limitations

### Time Spent
* **Code Review & Auditing**: ~45 minutes
* **Backend Refactoring & Leak Fixes**: ~45 minutes
* **UI Layout Restructuring & CSS Styling**: ~1.5 hours
* **Interactive Widget Components**: ~1.5 hours
* **Context State Management & Race Condition Fixes**: ~1 hour
* **Total Time**: ~5.5 hours

### Known Limitations
* **Local Storage Storage Cap**: Message histories and upload stats are held locally in `localStorage`, which caps out at approximately 5MB in most modern browsers.
* **Large PDF Ingestion**: Extracting text from files with excessive page counts or dense layouts may overflow the Gemini model's single-turn token limits.
* **Non-Scannable Images**: The PDF extraction layer (`pdf-parse`) processes only indexable text documents. OCR scanning is not supported for handwritten or rasterized image PDFs.
