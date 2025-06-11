import React from 'react';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open?: number;
  high?: number;
  low?: number;
  prevClose?: number;
}

interface StockTableProps {
  stocks: Stock[];
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  }).format(value / 100);
};

const StockTable: React.FC<StockTableProps> = ({ stocks }) => {
  return (
    <div className="stock-table-container">
      <table className="stock-table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Company Name</th>
            <th>Price</th>
            <th>Change</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Prev Close</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.symbol}>
              <td>
                <span className="symbol">{stock.symbol}</span>
              </td>
              <td>
                <span className="company-name">{stock.name}</span>
              </td>
              <td>
                <span className="price">{formatCurrency(stock.price)}</span>
              </td>
              <td>
                <div className={stock.change >= 0 ? 'positive' : 'negative'}>
                  <span className="change-value">{formatCurrency(stock.change)}</span>
                  <span className="change-percent">{formatPercentage(stock.changePercent)}</span>
                </div>
              </td>
              <td>{stock.open !== undefined ? formatCurrency(stock.open) : '-'}</td>
              <td>{stock.high !== undefined ? formatCurrency(stock.high) : '-'}</td>
              <td>{stock.low !== undefined ? formatCurrency(stock.low) : '-'}</td>
              <td>{stock.prevClose !== undefined ? formatCurrency(stock.prevClose) : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
