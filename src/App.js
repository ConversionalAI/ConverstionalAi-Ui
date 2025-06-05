import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import VoiceToText from "./components/VoiceToText";
import SearchResults from "./components/SearchResults";
import ScrapedResults from "./components/ScrapedResults";
import useScrapeData from "./components/UseScrapeData";
import LLMResponse from "./components/LLMResponse";
import Sidebar from "./components/SideBar";
import ImageResults from "./components/ImageResults";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import AskQuestion from "./components/AskQuestion";
import FileUploader from "./components/FileUploader"; // Import the new component

function App() {
  const [user, setUser] = useState(null);
  const [text, setText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { scrapedData, loading } = useScrapeData(searchResults);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const authListenerRef = useRef(null);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user || null);
        }
    );

    authListenerRef.current = subscription;

    // Clean up listener on unmount
    return () => {
      if (authListenerRef.current?.unsubscribe) {
        authListenerRef.current.unsubscribe();
      }
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  return (
      <div className={`App ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="main-content">
          <header className="App-header">
            <div className="container">
              <VoiceToText setText={setText} />
              <SearchResults
                  setSearchResults={setSearchResults}
                  text={text}
                  searchResults={searchResults}
              />
            </div>

            {loading && <p>Loading...</p>}

            <div className="scraped-llm-wrapper">
              <LLMResponse query={text} />

              {/* Flex container for AskQuestion and FileUploader */}
              <div className="ask-upload-container" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <AskQuestion />
                <FileUploader />
              </div>

              <div className="image-results-container">
                <ImageResults query={text} />
              </div>

              <ScrapedResults scrapedData={scrapedData} />
            </div>

            <div className="logout-button-container">
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>
        </div>
      </div>
  );
}

export default App;
