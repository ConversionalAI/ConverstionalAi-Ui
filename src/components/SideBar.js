import React, { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/transcriptions");
        const transcriptions = response.data.transcriptions || [];
        setHistory(transcriptions);
      } catch (error) {
        console.error("Error fetching transcription history:", error);
      }
    };

    if (sidebarOpen) {
      fetchTranscriptions(); // Only fetch when sidebar is opened
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
                history.map((item, index) => (
                  <li key={index}>
                    <button className="sidebar-link file-link">
                      {item.filename || `Untitled ${index + 1}`}
                    </button>
                  </li>
                ))
              ) : (
                <li>No history found</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
