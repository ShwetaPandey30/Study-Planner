import { useState } from "react";
import { generateStudyPlan } from "../services/plannerService";
import "../styles/StudyPlanner.css";

export default function StudyPlanner() {
  const [form, setForm] = useState({
    subjects: "",
    examDate: "",
    dailyHours: "4",
    level: "Beginner",
    weakSubjects: "",
    collegeStart: "09:00",
    collegeEnd: "13:00",
    breakMinutes: "15",
  });

  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setStudyPlan(null);

    try {
      const result = await generateStudyPlan(form);

      setStudyPlan(result);

      // Save the latest generated timetable in this browser.
      localStorage.setItem(
        "studyAIStudyPlan",
        JSON.stringify(result)
      );
    } catch (err) {
      console.error("Planner error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to generate timetable. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function loadSavedPlan() {
    const savedPlan = localStorage.getItem("studyAIStudyPlan");

    if (!savedPlan) {
      setError("No saved timetable found.");
      return;
    }

    try {
      setStudyPlan(JSON.parse(savedPlan));
      setError("");
    } catch {
      setError("Saved timetable could not be loaded.");
    }
  }

  function downloadPlan() {
    if (!studyPlan) return;

    const text = [
      studyPlan.title,
      "",
      studyPlan.summary,
      "",
      ...studyPlan.schedule.flatMap((day) => [
        day.day,
        ...day.sessions.map(
          (session) =>
            `${session.time} | ${session.subject} | ${session.activity} | ${session.durationMinutes} minutes`
        ),
        "",
      ]),
      "Study Tips:",
      ...(studyPlan.tips || []).map(
        (tip, index) => `${index + 1}. ${tip}`
      ),
    ].join("\n");

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "my-study-timetable.txt";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="planner-page">
      <div className="planner-header">
        <h1>📅 AI Study Planner</h1>

        <p>
          Create a personalized study timetable with the help of AI.
        </p>
      </div>

      <form className="planner-form" onSubmit={handleSubmit}>
        <div className="planner-field">
          <label htmlFor="subjects">
            Subjects *
          </label>

          <input
            id="subjects"
            name="subjects"
            value={form.subjects}
            onChange={handleChange}
            placeholder="DSA, DBMS, Operating System"
            required
          />

          <small>Separate subjects with commas.</small>
        </div>

        <div className="planner-field">
          <label htmlFor="examDate">
            Exam Date *
          </label>

          <input
            id="examDate"
            type="date"
            name="examDate"
            value={form.examDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div className="planner-field">
          <label htmlFor="dailyHours">
            Daily Study Hours *
          </label>

          <select
            id="dailyHours"
            name="dailyHours"
            value={form.dailyHours}
            onChange={handleChange}
          >
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
            <option value="4">4 hours</option>
            <option value="5">5 hours</option>
            <option value="6">6 hours</option>
            <option value="7">7 hours</option>
            <option value="8">8 hours</option>
          </select>
        </div>

        <div className="planner-field">
          <label htmlFor="level">
            Current Level
          </label>

          <select
            id="level"
            name="level"
            value={form.level}
            onChange={handleChange}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="planner-field">
          <label htmlFor="weakSubjects">
            Weak Subjects
          </label>

          <input
            id="weakSubjects"
            name="weakSubjects"
            value={form.weakSubjects}
            onChange={handleChange}
            placeholder="DSA, Operating System"
          />
        </div>

        <div className="planner-field">
          <label htmlFor="breakMinutes">
            Break Duration
          </label>

          <select
            id="breakMinutes"
            name="breakMinutes"
            value={form.breakMinutes}
            onChange={handleChange}
          >
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
            <option value="20">20 minutes</option>
          </select>
        </div>

        <div className="planner-field">
          <label htmlFor="collegeStart">
            College Start Time
          </label>

          <input
            id="collegeStart"
            type="time"
            name="collegeStart"
            value={form.collegeStart}
            onChange={handleChange}
          />
        </div>

        <div className="planner-field">
          <label htmlFor="collegeEnd">
            College End Time
          </label>

          <input
            id="collegeEnd"
            type="time"
            name="collegeEnd"
            value={form.collegeEnd}
            onChange={handleChange}
          />
        </div>

        <button
          className="generate-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Generating Your Timetable..."
            : "✨ Generate My Timetable"}
        </button>
      </form>

      <div className="planner-actions">
        <button
          type="button"
          onClick={loadSavedPlan}
          className="secondary-button"
        >
          Load Saved Timetable
        </button>

        {studyPlan && (
          <button
            type="button"
            onClick={downloadPlan}
            className="secondary-button"
          >
            Download Timetable
          </button>
        )}
      </div>

      {error && (
        <div className="planner-error">
          {error}
        </div>
      )}

      {studyPlan && (
        <section className="generated-plan">
          <h2>{studyPlan.title}</h2>

          <p>{studyPlan.summary}</p>

          {studyPlan.schedule?.map((day, index) => (
            <div className="day-card" key={`${day.day}-${index}`}>
              <h3>{day.day}</h3>

              <div className="table-wrapper">
                <table className="planner-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Subject</th>
                      <th>Activity</th>
                      <th>Duration</th>
                    </tr>
                  </thead>

                  <tbody>
                    {day.sessions?.map((session, sessionIndex) => (
                      <tr key={`${day.day}-${sessionIndex}`}>
                        <td>{session.time}</td>
                        <td>{session.subject}</td>
                        <td>{session.activity}</td>
                        <td>{session.durationMinutes} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {studyPlan.tips?.length > 0 && (
            <div className="study-tips">
              <h3>💡 Study Tips</h3>

              <ul>
                {studyPlan.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}