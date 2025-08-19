# Stock Dashboard

## 1. Technologies Used
- **React** (Javascript/Typescript)
- **Tailwind CSS** for responsive styling
- **Vite** as the build tool
- **Finnhub API** for stock data
- **Chart.js** (optional bonus feature for graph visualization)

## 2. Project Overview
This project is a **Stock Price Dashboard** that fetches real-time stock data from the Finnhub API and displays it in a responsive table. Users can see the current price and percentage change for selected stocks.

**Core Features Implemented:**
- Fetch stock data for selected symbols (AAPL, MSFT, GOOGL) using Finnhub API.
- Display stock data in a table (symbol, price, change %).
- Responsive styling with Tailwind CSS.
- Loading spinner displayed while fetching data.
- Search functionality to filter stocks by symbol.
- Sorting functionality for stock prices (ascending/descending).

**Optional Features Added:**
- Percentage change color-coded: green for positive, red for negative.
- Responsive layout ensures usability on mobile and desktop.
- Deployment on Vercel for live access.

## 3. Short Description of Additional Features Beyond Core Requirements
- Added **search and sorting** functionality for better usability.
- **Color-coded percentage changes** for quick visual reference.
- Included a **loading spinner** for a polished user experience while fetching data.
- Implemented **chart visualization locally** (optional bonus) to display stock price trends over time.  

## 4. Deployment
The dashboard is deployed on Vercel and can be accessed [here](https://stock-dashboard-rouge.vercel.app/).

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
