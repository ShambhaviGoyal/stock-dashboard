# 📈 Stock Market Dashboard

A modern, responsive **stock market dashboard** that fetches real-time data from the **Finnhub API** and displays it in an elegant interface with both **table and chart views**.  
Built with **React (TypeScript)**, **Tailwind CSS**, **Vite**, and **Chart.js**.

---

## 🚀 Live Demo  
👉 [View Deployed App on Vercel](https://stock-dashboard-rouge.vercel.app/)

---

## ⚙️ Tech Stack
- **React + TypeScript** – UI and state management  
- **Vite** – Fast build tool  
- **Tailwind CSS** – Responsive design system  
- **Chart.js** – Interactive visualizations  
- **Finnhub API** – Real-time stock data  

---

## 📊 Core Features
- ✅ Fetch live stock data for multiple tickers (AAPL, MSFT, GOOGL, etc.)  
- ✅ Display data in a clean, responsive **table layout**  
- ✅ Show **current price** and **percentage change**  
- ✅ **Loading spinner** during fetch requests  
- ✅ **Search and filter** by stock symbol  
- ✅ **Sorting functionality** for price (ascending/descending)  

---

## ✨ Bonus Features (Above & Beyond)

### 🔄 User Experience
- **Toggle View** – Switch between *Table* and *Charts* view  
- **Color-Coded Changes** – Green for gainers, red for losers  
- **Responsive UI** – Works flawlessly on mobile & desktop  
- **Hover effects & animations** for better interactivity  
- **Error handling** – Friendly retry messages  
- **No results state** – Clear feedback for empty searches  

### 📊 Chart Visualizations
- **Price Comparison Bar Chart** – Compare all stock prices (green = gainers, red = losers)  
- **Market Performance Doughnut Chart** – Split of gainers vs losers, instant market sentiment  
- **Top Performers List** – Ranked top 10 stocks by % change with prices  

### 🎨 Design & Branding
- **Professional Header** – Branding with *ValueGlance* logo & market status  
- **Dashboard Summary Cards** – Portfolio value, average change, active stocks  
- **Modern UI System** – Gradients, spacing, shadows, and consistent typography  
- **Status Badges** – Color-coded arrows (▲ ▼) for price changes  
- **Company Avatars** – Letter-based stock symbols  

---

## 5. Setup Instructions (Local)
1. Clone the repository:
   ```bash
   git clone <https://github.com/ShambhaviGoyal/stock-dashboard>
## Step 2: Setup and Run Project

1. **Install dependencies**
   ```bash
   npm install
2. **Add your Finnhub API key**  
   Create a `.env` file in the root directory and add:

   ```env
   VITE_FINNHUB_API_KEY=your_api_key_here
3. **Start the development server**
  ``bash
   npm run dev
4. **Open the app in your browser**  
Go to [http://localhost:5173](http://localhost:5173) to view the stock dashboard.
