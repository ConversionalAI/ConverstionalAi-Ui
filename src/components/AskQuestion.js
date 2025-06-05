import React, { useState } from "react";
import axios from "axios";

const AskQuestion = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);

    const askQuestion = async () => {
        if (!question.trim()) {
            console.error("Please enter a question.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/ask", { question });
            setAnswer(response.data.answer);
        } catch (error) {
            console.error("Error asking question:", error);
            setAnswer("An error occurred while fetching the answer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ask-container">
            <h2>Ask a Question</h2>

            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                className="question-input"
                placeholder="Type your question here"
            />

            <button onClick={askQuestion} disabled={!question.trim() || loading}>
                {loading ? "Asking..." : "Ask"}
            </button>

            <div className="answer-display">
                {answer && (
                    <div className="answer-box">
                        <strong>Answer:</strong>
                        <p>{answer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AskQuestion;
