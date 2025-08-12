import { useState, useEffect } from 'react';

const UseScrapeData = (searchResults) => {
    const [scrapedData, setScrapedData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchScrapedData = async () => {
            if (searchResults.length === 0) return;

            const urls = searchResults.map(result => result.link);
            setLoading(true);

            try {
                const res = await fetch("http://localhost:8000/scrape/", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pages: urls })
                });
                if (!res.ok) throw new Error(`Scrape failed with ${res.status}`);
                const data = await res.json();
                setScrapedData(data.scraped_data);
            } catch (error) {
                console.error("Error scraping:", error);
            }

            setLoading(false);
        };

        if (searchResults.length > 0) {
            fetchScrapedData();
        }
    }, [searchResults]);

    return { scrapedData, loading };
};

export default UseScrapeData;