import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import PdfPage from "./pages/PdfPage";
import Settings from "./pages/Settings";
import StudyPlanner from "./pages/StudyPlanner";
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/pdf" element={<PdfPage />} />
        <Route path="/settings" element={<Settings />}
         />
        <Route path="/study-planner" element={<StudyPlanner />} />
      </Routes>
    </Layout>
  );
}

export default App;