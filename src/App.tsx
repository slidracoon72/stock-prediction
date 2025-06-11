import React, { useState } from 'react';
import StockTable from './StockTable';
import type { Stock } from './StockTable';
import Pagination from './Pagination';
import './App.css';

const PAGE_SIZE = 25;

function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Simple in-memory cache for fetched stock data by page
  const stockCache = React.useRef<{ [page: number]: Stock[] }>({});

  React.useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      setError(null);
      // Check cache first
      if (stockCache.current[currentPage]) {
        setStocks(stockCache.current[currentPage]);
        setLoading(false);
        return;
      }
      try {
        const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;
        if (!apiKey) {
          setError('API key is missing. Please set VITE_FINNHUB_API_KEY in your .env file.');
          setLoading(false);
          return;
        }
        // Fetch S&P 500 symbols from the public folder
        const sp500Res = await fetch('/sp500.json');
        if (!sp500Res.ok) throw new Error('Failed to fetch S&P 500 list');
        let sp500List: { symbol: string; name: string }[] = [];
        try {
          sp500List = await sp500Res.json();
        } catch (e) {
          throw new Error(`Invalid S&P 500 data format: ${e}`);
        }
        if (!Array.isArray(sp500List) || sp500List.length === 0) throw new Error('No S&P 500 data received');
        // Calculate the companies for the current page
        const startIdx = (currentPage - 1) * PAGE_SIZE;
        const endIdx = startIdx + PAGE_SIZE;
        const pagedList = sp500List.slice(startIdx, endIdx);
        // Fetch quotes for each symbol from Finnhub
        const allQuotes: Stock[] = [];
        await Promise.all(
          pagedList.map(async (company) => {
            try {
              const quoteRes = await fetch(`https://finnhub.io/api/v1/quote?symbol=${company.symbol}&token=${apiKey}`);
              if (!quoteRes.ok) return;
              const quote = await quoteRes.json();
              allQuotes.push({
                symbol: company.symbol,
                name: company.name,
                price: typeof quote.c === 'number' ? quote.c : 0,
                change: typeof quote.d === 'number' ? quote.d : 0,
                changePercent: typeof quote.dp === 'number' ? quote.dp : 0,
                open: typeof quote.o === 'number' ? quote.o : undefined,
                high: typeof quote.h === 'number' ? quote.h : undefined,
                low: typeof quote.l === 'number' ? quote.l : undefined,
                prevClose: typeof quote.pc === 'number' ? quote.pc : undefined,
              });
            } catch {
              // Ignore individual fetch errors
            }
          })
        );
        // Sort by highest gain to lowest gain for the day
        allQuotes.sort((a, b) => (b.changePercent ?? 0) - (a.changePercent ?? 0));
        stockCache.current[currentPage] = allQuotes;
        setStocks(allQuotes);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, [currentPage]);

  // Calculate total pages based on 500 companies
  const totalPages = Math.ceil(500 / PAGE_SIZE);
  const paginatedStocks = stocks;

  return (
    <div className="app-container">
      <div className="header-section">
        <h1 className="sp500-header">S&amp;P 500 Stocks</h1>
        <p className="header-subtitle">Real-time market data and performance tracking for S&amp;P 500 companies</p>
      </div>
      <div className="main-content">
        {loading && (
          <div className="loading" role="status" aria-label="Loading stock data">
            <div className="loading-spinner" />
            <div className="loading-text">Loading Market Data</div>
            <div className="loading-subtext">Fetching latest stock information...</div>
          </div>
        )}
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        {!loading && !error && paginatedStocks.length > 0 && (
          <>
            <div className="stock-table-container">
              <StockTable stocks={paginatedStocks} />
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
        {!loading && !error && paginatedStocks.length === 0 && (
          <div className="no-data-message">
            No stock data available.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
