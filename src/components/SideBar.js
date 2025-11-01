import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import { supabase } from "../supabaseClient";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [history, setHistory] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/transcriptions`);
        if (!res.ok) throw new Error(`History fetch failed with ${res.status}`);
        const response = await res.json();
        const transcriptions = response.transcriptions || [];
        setHistory(transcriptions);
      } catch (error) {
        console.error("Error fetching transcription history:", error);
      }
    };

    const fetchChats = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const user_id = userData?.user?.id;
        if (!user_id) return;
        const res = await fetch(`${API_BASE_URL}/chats?user_id=${encodeURIComponent(user_id)}`);
        if (!res.ok) throw new Error(`Chats fetch failed with ${res.status}`);
        const response = await res.json();
        setChats(response.chats || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    if (sidebarOpen) {
      fetchTranscriptions(); // Only fetch when sidebar is opened
      fetchChats();
    }
  }, [sidebarOpen]);

  return (
    <div>
      {!sidebarOpen && (
        <button
          className="toggle-sidebar-btn outside"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      {sidebarOpen && (
        <div className="sidebar">
          <button
            className="toggle-sidebar-btn inside"
            onClick={() => setSidebarOpen(false)}
          >
            ✖
          </button>

          <div style={{ marginTop: "20px" }}>
            <h3>Conversation History</h3>
            <ul className="conversation-history">
              {history.length > 0 ? (
                history.map((item, index) => {
                  // Remove .wav extension from filename for display
                  const displayName = item.filename 
                    ? item.filename.replace(/\.wav$/i, '') 
                    : `Untitled ${index + 1}`;
                  
                  return (
                    <li key={index}>
                      <button className="sidebar-link file-link">
                        {displayName}
                      </button>
                    </li>
                  );
                })
              ) : (
                <li>No history found</li>
              )}
            </ul>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3>Chat History</h3>
            <ul className="conversation-history">
              {chats.length > 0 ? (
                chats.map((c, idx) => (
                  <li key={idx}>
                    <button className="sidebar-link file-link" title={c.answer}>
                      {c.question?.slice(0, 40) || "(no question)"}
                    </button>
                  </li>
                ))
              ) : (
                <li>No chats yet</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
