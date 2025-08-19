import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface StockChartProps {
  symbol: string;
  prices: number[];
}

export default function StockChart({ symbol, prices }: StockChartProps) {
  const data = {
    labels: prices.map((_, i) => `T-${prices.length - i}`),
    datasets: [
      {
        label: symbol,
        data: prices,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} className="h-32 w-full" />;
}
