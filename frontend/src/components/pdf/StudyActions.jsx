function StudyActions({ loading, onGenerate }) {
  const actions = [
    {
      label: "📝 Summary",
      type: "summary",
    },
    {
      label: "📘 Detailed Notes",
      type: "notes",
    },
    {
      label: "🃏 Flashcards",
      type: "flashcards",
    },
    {
      label: "❓ Quiz",
      type: "quiz",
    },
    {
      label: "🎯 Interview Questions",
      type: "questions",
    },
    {
      label: "🧠 Explain Difficult Topics",
      type: "explain",
    },
  ];

  return (
    <>
      <h2 className="section-title">
        Generate Study Material
      </h2>

      <div className="actions-grid">
        {actions.map((action) => (
          <button
            key={action.type}
            className="action-btn"
            onClick={() => onGenerate(action.type)}
            disabled={loading}
          >
            {loading
              ? "Generating..."
              : action.label}
          </button>
        ))}
      </div>
    </>
  );
}

export default StudyActions;