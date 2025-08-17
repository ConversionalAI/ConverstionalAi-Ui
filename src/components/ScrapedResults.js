import React from 'react';

const ScrapedResults = ({ scrapedData }) => {
    if (!scrapedData || scrapedData.length === 0) {
        return (
            <div className="scraped-results-container">
                <h2>Results from the Web</h2>
                <p>No scraped data available.</p>
            </div>
        );
    }

    return (
        <div className="scraped-results-container">
            <h2>Results from the Web</h2>
            <div className="scraped-results-grid">
                {scrapedData.map((item, index) => (
                    <div key={index} className="scraped-result-item">
                        <div className="result-content">
                            <p style={{ wordWrap: 'break-word', marginBottom: '10px' }}>
                                {item.summary}
                            </p>
                            <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="reference-link"
                            >
                                (Reference Link)
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScrapedResults;