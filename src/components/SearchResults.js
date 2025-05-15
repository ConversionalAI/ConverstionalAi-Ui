import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchResults = ({ setSearchResults, text, searchResults }) => {
  const [editableText, setEditableText] = useState(text);

  useEffect(() => {
    setEditableText(text); // Update editable text whenever new transcription comes in
  }, [text]);

  const searchGoogle = async () => {
    if (!editableText.trim()) {
      console.error("No text to search!");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/search?q=${encodeURIComponent(editableText)}`);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <div className="search-container">
      <h2>Here are your facts</h2>

      <textarea
        value={editableText}
        onChange={(e) => setEditableText(e.target.value)}
        rows={3}
        className="editable-search-text"
        placeholder="Edit your question before searching"
      />

      <button onClick={searchGoogle} disabled={!editableText.trim()}>Search</button>

      <div className="search-results">
        {searchResults && searchResults.length > 0 ? (
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>
                <a href={result.link} target="_blank" rel="noopener noreferrer">
                  {result.title}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No search results yet.</p>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
