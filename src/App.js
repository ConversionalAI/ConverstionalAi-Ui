import React, { useState, useEffect, useRef, Suspense } from "react";
import "./App.css";
import useScrapeData from "./components/UseScrapeData";
import { supabase } from "./supabaseClient";

const VoiceToText = React.lazy(() => import("./components/VoiceToText"));
const SearchResults = React.lazy(() => import("./components/SearchResults"));
const ScrapedResults = React.lazy(() => import("./components/ScrapedResults"));
const LLMResponse = React.lazy(() => import("./components/LLMResponse"));
const Sidebar = React.lazy(() => import("./components/SideBar"));
const ImageResults = React.lazy(() => import("./components/ImageResults"));
const Auth = React.lazy(() => import("./components/Auth"));
const AskQuestion = React.lazy(() => import("./components/AskQuestion"));
const FileUploader = React.lazy(() => import("./components/FileUploader"));

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    authListenerRef.current = subscription;

    // Clean up listener on unmount
    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  if (!user) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Auth setUser={setUser} />
      </Suspense>
    );
  }

  return (
    <div className={`App ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Suspense fallback={<div />}> 
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </Suspense>

      <div className="main-content">
        <header className="App-header">
          <div className="container">
            <Suspense fallback={<div />}> 
              <VoiceToText setText={setText} />
              <SearchResults
                setSearchResults={setSearchResults}
                text={text}
                searchResults={searchResults}
              />
            </Suspense>
          </div>

          {loading && <p>Loading...</p>}

          <div className="scraped-llm-wrapper">
            <Suspense fallback={<div />}> 
              <LLMResponse query={text} />

              <div className="ask-upload-container" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <AskQuestion />
                <FileUploader />
              </div>

              <div className="image-results-container">
                <ImageResults query={text} />
              </div>

              <ScrapedResults scrapedData={scrapedData} />
            </Suspense>
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
