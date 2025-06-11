# S&P 500 Real-Time Stock Market App

This is a modern, real-time S&P 500 stock market dashboard built with React, Vite, and TypeScript. The app displays live stock data S&P 500 companies, with a sleek, dark, and responsive UI. It features real-time price updates, daily gain sorting, pagination, and basic buy/sell recommendations based on market trends.

---

## Features
- Real-time stock price updates for S&P 500 companies (via Finnhub API)
- Modern, dark, and fully responsive design
- Table displays: price, change, % change, open, high, low, previous close
- Pagination (25 stocks per page)
- Sorted by daily % gain (highest to lowest)
- Handles API rate limits and caches results
- Displays dashes for unavailable data
- Buy/sell recommendations (basic logic)

---

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/slidracoon72/stock-prediction.git
cd stock-prediction
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up API key
Create a `.env` file in the project root with your [Finnhub](https://finnhub.io/) API key:
```
VITE_FINNHUB_API_KEY=your_finnhub_api_key_here
```

### 4. Install dependencies and start the development server
```bash
npm install
npm run dev
```
The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### 5. Build for production
```bash
npm run build
```

---

## Project Structure
- `src/` - Main source code (components, styles, logic)
- `public/sp500.json` - List of S&P 500 companies (symbol, name)
- `.env` - API key for Finnhub (not committed)
- `.github/copilot-instructions.md` - Copilot custom instructions

---

## Deployment
You can deploy the production build to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

---

## Credits
- Entire project developed in **30 minutes** with [GitHub Copilot](https://github.com/features/copilot) and [Cursor](https://www.cursor.so/).
- Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), and [TypeScript](https://www.typescriptlang.org/).

---

## License
This project is licensed under the MIT License.
