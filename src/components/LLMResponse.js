import React, { useState } from "react";

const LLMResponse = ({ query }) => {
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchLLMResponse = async () => {
        if (!query.trim()) {
            setResponse("Please enter a query.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/llm/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: query })  // Ensure 'prompt' matches backend
            });

            const data = await res.json();
            console.log("LLM API Response:", data); // Debugging output

            if (!res.ok) {
                throw new Error(data.detail || "Error fetching LLM response");
            }

            setResponse(data.response || "No response received.");  // Correct response key
        } catch (error) {
            console.error("Error fetching LLM response:", error);
            setResponse("Failed to fetch response.");
        }
        setLoading(false);
    };

    return (
        <div className="llm-response-container">
            <h2>LLM Response</h2>
            <button className="llm-button" onClick={fetchLLMResponse} disabled={loading}>
                {loading ? "Loading..." : "Get LLM Response"}
            </button>
            <div className="llm-response-box">
                {response ? <p>{response}</p> : <p className="placeholder">Click "Get LLM Response" to generate text.</p>}
            </div>
        </div>
    );
};

export default LLMResponse;
