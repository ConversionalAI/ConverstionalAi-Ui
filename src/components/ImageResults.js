import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config";

function ImageResults({ query }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    const fetchImages = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/image-search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error(`Image search failed with ${res.status}`);
        const data = await res.json();
        setImages(data.images || []);
      } catch (err) {
        setError("Failed to fetch image results.");
        console.error("Image search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [query]);

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextElementSibling.style.display = 'block';
  };

  if (!query) {
    return null;
  }

  return (
    <div className="image-results">
      <h2>Image Results for: "{query}"</h2>
      
      {loading && (
        <div className="loading-container">
          <p>Loading images...</p>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      )}
      
      {!loading && !error && images.length === 0 && (
        <div className="no-results">
          <p>No images found for your search.</p>
        </div>
      )}
      
      {!loading && !error && images.length > 0 && (
        <div className="image-grid">
          {images.map((img, index) => (
            <a 
              key={index}
              href={img.context_link} 
              target="_blank" 
              rel="noopener noreferrer"
              title={img.title}
              className="image-item"
            >
              <img 
                src={img.image_link} 
                alt={img.title || `Image ${index + 1}`} 
                loading="lazy"
                onError={handleImageError}
              />
              <div className="image-fallback" style={{ display: 'none' }}>
                <span>Image not available</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageResults;
