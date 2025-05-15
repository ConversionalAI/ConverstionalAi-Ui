import React from 'react';

const ScrapedResults = ({ scrapedData }) => {
    if (!scrapedData || scrapedData.length === 0) {
        return (
            <div className="scraped-results-container">
                <h2>Scraped Data</h2>
                <p>No scraped data available.</p>
            </div>
        );
    }

    return (
        <>
            {scrapedData.map((item, index) => (
                <div key={index} className="scraped-results-container">
                    <h2>Scraped Result {index + 1}</h2>
                    <div className="scraped-results">
                        <ul style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <li style={{ wordWrap: 'break-word' }}>
                                <strong>{item.url}</strong>: {item.summary}
                            </li>
                        </ul>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ScrapedResults;