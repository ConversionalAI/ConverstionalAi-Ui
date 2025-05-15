import { useState, useEffect } from 'react';
import axios from 'axios';

const UseScrapeData = (searchResults) => {
    const [scrapedData, setScrapedData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchScrapedData = async () => {
            if (searchResults.length === 0) return;

            const urls = searchResults.map(result => result.link);
            setLoading(true);

            try {
                const response = await axios.post("http://localhost:8000/scrape/",
                    { pages: urls },
                    { headers: { "Content-Type": "application/json" } }
                );
                setScrapedData(response.data.scraped_data);
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