export function buildPrompt(type, text) {
  switch (type) {
    case "summary":
      return `
You are an AI Study Assistant.

Read the following study material and generate a concise summary.

Requirements:
- Use Markdown.
- Explain in simple language.
- Use headings and bullet points.
- Keep only the important ideas.

Study Material:

${text}
`;

    case "notes":
      return `
You are an AI Study Assistant.

Convert the following study material into detailed study notes.

Requirements:
- Use Markdown.
- Use headings and subheadings.
- Include bullet points.
- Highlight important concepts.
- Add examples wherever possible.

Study Material:

${text}
`;

    case "quiz":
      return `
You are an AI Study Assistant.

Analyze the study material below and generate a multiple-choice quiz.
Create exactly 10 questions.
For each question, provide exactly 4 options, identify the 0-indexed correct option (0, 1, 2, or 3), and write a helpful explanation of why that option is correct.

Study Material:

${text}
`;

    case "flashcards":
      return `
You are an AI Study Assistant.

Analyze the study material below and generate at least 15 flashcards.
Each flashcard must contain a clear question or term and a concise answer or explanation.

Study Material:

${text}
`;

    case "questions":
      return `
You are an AI Study Assistant.

Generate a list of 10 relevant technical or conceptual interview questions based on the following study material.
For each question, provide a detailed model answer.

Requirements:
- Use Markdown.
- Use headings and subheadings.
- Separate questions clearly.
- Highlight key terminology in the model answers.

Study Material:

${text}
`;

    case "explain":
      return `
You are an AI Study Assistant.

Identify the most complex or difficult topics, concepts, or terminology in the following study material and explain them in simpler terms.

Requirements:
- Use Markdown.
- Break down definitions.
- Use analogies, examples, or simple code blocks if applicable.
- Structure with clear headings and bullet points.

Study Material:

${text}
`;

    default:
      return `
Summarize the following study material.

${text}
`;
  }
}