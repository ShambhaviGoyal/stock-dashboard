import { useState, useEffect } from 'react';
import './index.css';
import StockChart from './StockChart'; // chart component we created

interface Stock {
  symbol: string;
  price: number;
  change: number;
  history?: number[];
}

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const symbols = ["AAPL", "MSFT", "GOOGL"]; // example stocks
        const results: Stock[] = [];
        const apiKey = import.meta.env.VITE_FINNHUB_API_KEY;

        for (let symbol of symbols) {
          const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
          );
          const data = await res.json();

          // create some dummy historical data for charts
          const history = Array.from({ length: 10 }, () => data.c + Math.random() * 10 - 5);

          results.push({
            symbol,
            price: data.c ?? 0,
            change: data.c && data.pc ? ((data.c - data.pc) / data.pc) * 100 : 0,
            history,
          });
        }

        setStocks(results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // filter by search input
  const filteredStocks = stocks.filter((stock) =>
    stock.symbol.includes(search.toUpperCase())
  );

  // sort by price
  const displayedStocks = [...filteredStocks].sort((a, b) =>
    sortAsc ? a.price - b.price : b.price - a.price
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Stock Dashboard</h1>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search by symbol..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-1/2"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Symbol</th>
              <th
                className="py-2 px-4 text-left cursor-pointer"
                onClick={() => setSortAsc(!sortAsc)}
              >
                Price {sortAsc ? '↑' : '↓'}
              </th>
              <th className="py-2 px-4 text-left">Change %</th>
              <th className="py-2 px-4 text-left">Trend</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </td>
              </tr>
            ) : displayedStocks.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center">
                  No stocks found
                </td>
              </tr>
            ) : (
              displayedStocks.map((stock) => (
                <tr key={stock.symbol} className="border-b">
                  <td className="py-2 px-4">{stock.symbol}</td>
                  <td className="py-2 px-4">${stock.price.toFixed(2)}</td>
                  <td
                    className={`py-2 px-4 ${
                      stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stock.change.toFixed(2)}%
                  </td>
                  <td className="py-2 px-4 w-32">
                    {stock.history && <StockChart symbol={stock.symbol} prices={stock.history} />}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
