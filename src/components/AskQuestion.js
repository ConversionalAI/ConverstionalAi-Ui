import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { supabase } from "../supabaseClient";

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
            const { data: userData } = await supabase.auth.getUser();
            const user_id = userData?.user?.id || null;

            const res = await fetch(`${API_BASE_URL}/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, user_id })
            });
            if (!res.ok) throw new Error(`Ask failed with ${res.status}`);
            const data = await res.json();
            setAnswer(data.answer);
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
