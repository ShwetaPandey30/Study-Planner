import api from "./api";

export async function generateStudyPlan(formData) {
  const response = await api.post(
    "/api/planner/generate",
    formData
  );

  return response.data.studyPlan;
}