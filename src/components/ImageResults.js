import React, { useEffect, useState } from "react";

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
        const res = await fetch(`http://localhost:8000/image-search?q=${encodeURIComponent(query)}`);
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

  return (
    <div className="image-results">
      <h2>Image Results</h2>
      {loading && <p>Loading images...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="image-grid">
        {images.map((img, index) => (
          <div key={index} className="image-item">
            <a href={img.context_link} target="_blank" rel="noopener noreferrer">
              <img src={img.image_link} alt={img.title} loading="lazy" />
            </a>
            <p>{img.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ImageResults;
