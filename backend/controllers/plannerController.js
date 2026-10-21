import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateStudyPlan(req, res) {
  try {
    const {
      subjects,
      examDate,
      dailyHours,
      level,
      weakSubjects,
      collegeStart,
      collegeEnd,
      breakMinutes,
    } = req.body;

    // Validate required fields
    if (
      !subjects ||
      !subjects.trim() ||
      !examDate ||
      !dailyHours
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const subjectList = subjects
      .split(",")
      .map((subject) => subject.trim())
      .filter(Boolean);

    if (subjectList.length === 0) {
      return res.status(400).json({
        message: "Please enter at least one subject.",
      });
    }

    const prompt = `
You are an expert AI study planner.

Create a realistic personalized study timetable for a student.

Student details:
Subjects: ${subjectList.join(", ")}
Exam date: ${examDate}
Daily available study hours: ${dailyHours}
Current level: ${level || "Beginner"}
Weak subjects: ${weakSubjects || "Not specified"}
College timing: ${
      collegeStart && collegeEnd
        ? `${collegeStart} to ${collegeEnd}`
        : "Not specified"
    }
Break duration: ${breakMinutes || 15} minutes

Requirements:
1. Give additional practice time to weak subjects.
2. Include short breaks between study sessions.
3. Include revision and practice questions.
4. Do not schedule study during college hours.
5. Make the schedule realistic.
6. Do not exceed the daily available study hours.
7. Use the subjects provided by the student.
8. Generate a 7-day timetable.
9. Use 12-hour time format with AM/PM.
10. Return valid JSON only. Do not use Markdown fences.

Use exactly this JSON structure:
{
  "title": "My Personalized Study Plan",
  "summary": "A short explanation of the plan",
  "dailyHours": ${Number(dailyHours)},
  "schedule": [
    {
      "day": "Monday",
      "sessions": [
        {
          "time": "2:00 PM - 3:00 PM",
          "subject": "DSA",
          "activity": "Practice arrays",
          "durationMinutes": 60,
          "type": "Study"
        }
      ]
    }
  ],
  "tips": [
    "Study tip 1",
    "Study tip 2"
  ]
}

Include all seven days from Monday to Sunday.
Make sure the JSON is valid.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    // Remove Markdown fences if the model adds them.
    const cleanedText = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    const studyPlan = JSON.parse(cleanedText);

    return res.status(200).json({
      success: true,
      studyPlan,
    });
  } catch (error) {
    console.error("Study planner error:", error.message);

    return res.status(500).json({
      message:
        "Unable to generate the study timetable. Please try again.",
      error: error.message,
    });
  }
}