import React, { useState } from "react";
import { API_BASE_URL } from "../config";
import { supabase } from "../supabaseClient";

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
            const { data: userData } = await supabase.auth.getUser();
            const user_id = userData?.user?.id || null;

            const res = await fetch(`${API_BASE_URL}/llm/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: query, user_id })  // Ensure keys match backend
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
