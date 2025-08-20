import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; 

type ChartType = InstanceType<typeof Chart>; 


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function App() {
  type Stock = { symbol: string; price: number; change: number; marketCap?: string };

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'charts'>('table');
  
  const chartRef = useRef<ChartType | null>(null);
  const performanceChartRef = useRef<ChartType | null>(null);


  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mock data for demonstration since we don't have API keys
        const mockStocks: Stock[] = [
          { symbol: 'AAPL', price: 175.43, change: 2.1, marketCap: '2.7T' },
          { symbol: 'MSFT', price: 338.11, change: -0.8, marketCap: '2.5T' },
          { symbol: 'GOOGL', price: 125.37, change: 1.5, marketCap: '1.6T' },
          { symbol: 'AMZN', price: 127.74, change: -1.2, marketCap: '1.3T' },
          { symbol: 'META', price: 296.73, change: 3.4, marketCap: '750B' },
          { symbol: 'NVDA', price: 421.06, change: 5.7, marketCap: '1.0T' },
          { symbol: 'TSLA', price: 248.50, change: -2.3, marketCap: '790B' },
          { symbol: 'JPM', price: 145.22, change: 0.9, marketCap: '425B' },
          { symbol: 'JNJ', price: 158.31, change: -0.4, marketCap: '420B' },
          { symbol: 'WMT', price: 159.67, change: 1.1, marketCap: '515B' },
        ];
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStocks(mockStocks);
      } catch (e) {
        setError('Unable to fetch stock data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  const filteredStocks = stocks.filter(s => s.symbol.toLowerCase().includes(search.toLowerCase()));
  const displayedStocks = [...filteredStocks].sort((a,b) => sortAsc ? a.price - b.price : b.price - a.price);
  const totalValue = stocks.reduce((sum, s) => sum + s.price, 0);
  const avgChange = stocks.length ? stocks.reduce((sum, s) => sum + s.change, 0) / stocks.length : 0;

  // Charts using Chart.js
  useEffect(() => {
    if (stocks.length === 0 || viewMode !== 'charts') return;

    // Destroy existing charts
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    if (performanceChartRef.current) {
      performanceChartRef.current.destroy();
    }

    const priceCanvas = document.getElementById('priceChart') as HTMLCanvasElement;
    if (priceCanvas) {
      const ctx = priceCanvas.getContext('2d');
      if (ctx) {
        chartRef.current = new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: stocks.map(s => s.symbol),
            datasets: [{
              label: 'Stock Prices ($)',
              data: stocks.map(s => s.price),
              backgroundColor: stocks.map(s => s.change >= 0 ? 'rgba(34,197,94,0.7)' : 'rgba(239,68,68,0.7)'),
              borderColor: stocks.map(s => s.change >= 0 ? 'rgba(34,197,94,1)' : 'rgba(239,68,68,1)'),
              borderWidth: 2,
              borderRadius: 8,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { display: false }, 
              title: { display: true, text: 'Stock Prices Comparison' } 
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + Number(value).toFixed(0);
                  }
                }
              },
              x: { grid: { display: false } }
            }
          }
        });
      }
    }

    const perfCanvas = document.getElementById('performanceChart') as HTMLCanvasElement;
    if (perfCanvas) {
      const ctx = perfCanvas.getContext('2d');
      if (ctx) {
        const gainers = stocks.filter(s => s.change >= 0).length;
        const losers = stocks.length - gainers;
        
        performanceChartRef.current = new ChartJS(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Gainers', 'Losers'],
            datasets: [{
              data: [gainers, losers],
              backgroundColor: ['rgba(34,197,94,0.8)', 'rgba(239,68,68,0.8)'],
              borderColor: ['rgba(34,197,94,1)', 'rgba(239,68,68,1)'],
              borderWidth: 2,
              hoverOffset: 4
            }]
          },
          options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { 
              legend: { position: 'bottom' },
              title: { display: true, text: 'Market Performance Overview' }
            } 
          }
        });
      }
    }

    return () => {
      if (chartRef.current) chartRef.current.destroy();
      if (performanceChartRef.current) performanceChartRef.current.destroy();
    };
  }, [stocks, viewMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">VG</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  ValueGlance
                </h1>
                <p className="text-sm text-gray-500">Stock Market Dashboard</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Market Status</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">Markets Open</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Change</p>
                <p className={`text-2xl font-bold ${avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
                </p>
              </div>
              <div className={`w-12 h-12 ${avgChange >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                <svg className={`w-6 h-6 ${avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={avgChange >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Stocks</p>
                <p className="text-2xl font-bold text-gray-900">{stocks.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search stocks by symbol..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full sm:w-80"
                />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'table' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Table View
                </button>
                <button
                  onClick={() => setViewMode('charts')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'charts' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Chart View
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Showing {displayedStocks.length} of {stocks.length} stocks
            </div>
          </div>
        </div>

        {/* Charts View */}
        {viewMode === 'charts' && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="h-80">
                <canvas id="priceChart"></canvas>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="h-80">
                <canvas id="performanceChart"></canvas>
              </div>
            </div>
          </div>
        )}

        {/* Stock Table */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Symbol
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setSortAsc(!sortAsc)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Price</span>
                        <svg className={`w-4 h-4 transform transition-transform ${sortAsc ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change %
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Market Cap
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="relative">
                            <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
                            <div className="w-12 h-12 border-4 border-blue-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
                          </div>
                          <p className="text-gray-500 font-medium">Loading stock data...</p>
                          <p className="text-sm text-gray-400">Fetching real-time market information</p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-900 font-medium mb-1">Failed to load stock data</p>
                            <p className="text-gray-500 text-sm">{error}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : displayedStocks.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-900 font-medium mb-1">No stocks found</p>
                            <p className="text-gray-500 text-sm">Try adjusting your search criteria</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayedStocks.map((stock, index) => (
                      <tr 
                        key={stock.symbol} 
                        className="hover:bg-blue-50 transition-colors cursor-pointer group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                              {stock.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">{stock.symbol}</div>
                              <div className="text-xs text-gray-500">Stock Symbol</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-900">
                            ${stock.price.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            stock.change >= 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {stock.change >= 0 ? (
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                              </svg>
                            )}
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                          {stock.marketCap || 'N/A'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Built with React, TypeScript & Tailwind CSS • Data refreshes every 15 seconds
          </p>
          <p className="text-xs text-gray-400 mt-1">
            ValueGlance - Simplifying Finance Through Technology
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;