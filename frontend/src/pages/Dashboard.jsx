import { useState, useEffect } from "react";
import { FaFilePdf, FaComments, FaRobot, FaGraduationCap } from "react-icons/fa";

function Dashboard() {
  const [stats, setStats] = useState({
    uploads: 0,
    chats: 0,
    generated: 0
  });

  useEffect(() => {
    // 1. Fetch PDF upload and generation stats
    try {
      const savedStats = JSON.parse(localStorage.getItem("aiStudyStats") || '{"uploads":0,"chats":0,"generated":0}');
      
      // 2. Fetch Chat message count dynamically from chatMessages
      const chatMessages = JSON.parse(localStorage.getItem("chatMessages") || "[]");
      const userMessageCount = chatMessages.filter(m => m.sender === "user").length;

      setStats({
        uploads: savedStats.uploads || 0,
        chats: userMessageCount,
        generated: savedStats.generated || 0
      });
    } catch (err) {
      console.error("Failed to load dashboard statistics:", err);
    }
  }, []);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", animation: "fadeIn 0.5s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
        <span style={{ fontSize: "36px" }}>🎓</span>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Study Dashboard</h1>
          <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>Track your AI study assistant activity and learning analytics.</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginTop: "32px",
        }}
      >
        {/* Card 1: PDFs */}
        <div
          className="dashboard-card"
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
        >
          <div style={{ background: "#eff6ff", color: "#2563eb", padding: "16px", borderRadius: "12px", fontSize: "24px", display: "flex" }}>
            <FaFilePdf />
          </div>
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>PDFs Uploaded</h2>
            <p style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "4px 0 0 0" }}>{stats.uploads}</p>
          </div>
        </div>

        {/* Card 2: Chats */}
        <div
          className="dashboard-card"
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
        >
          <div style={{ background: "#ecfdf5", color: "#10b981", padding: "16px", borderRadius: "12px", fontSize: "24px", display: "flex" }}>
            <FaComments />
          </div>
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>Chats Sent</h2>
            <p style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "4px 0 0 0" }}>{stats.chats}</p>
          </div>
        </div>

        {/* Card 3: AI Requests */}
        <div
          className="dashboard-card"
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
        >
          <div style={{ background: "#faf5ff", color: "#a855f7", padding: "16px", borderRadius: "12px", fontSize: "24px", display: "flex" }}>
            <FaRobot />
          </div>
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>AI Material Generated</h2>
            <p style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "4px 0 0 0" }}>{stats.generated}</p>
          </div>
        </div>
      </div>

      {/* Helpful Quick Tip box */}
      <div style={{
        marginTop: "40px",
        background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        borderRadius: "16px",
        padding: "32px",
        color: "white",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <FaGraduationCap style={{ fontSize: "24px", color: "#3b82f6" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>Pro Study Tip</h3>
        </div>
        <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", margin: 0, maxWidth: "600px" }}>
          Upload a PDF under the **PDF Assistant** tab, then select **Quiz** or **Flashcards** to generate interactive learning widgets. These are custom-formatted by the AI to help test your memory and retention active recall styles.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;