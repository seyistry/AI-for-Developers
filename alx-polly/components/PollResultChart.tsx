'use client';

import { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define types for the component props
type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type PollResultChartProps = {
  options: PollOption[];
  title?: string;
};

// Define chart colors
const CHART_COLORS = [
  'rgba(54, 162, 235, 0.8)', // Blue
  'rgba(255, 99, 132, 0.8)',  // Pink
  'rgba(75, 192, 192, 0.8)',  // Teal
  'rgba(255, 206, 86, 0.8)',  // Yellow
  'rgba(153, 102, 255, 0.8)', // Purple
  'rgba(255, 159, 64, 0.8)',  // Orange
  'rgba(199, 199, 199, 0.8)', // Gray
  'rgba(83, 102, 255, 0.8)',  // Indigo
  'rgba(255, 99, 71, 0.8)',   // Tomato
  'rgba(46, 204, 113, 0.8)',  // Green
];

// Get border colors (slightly darker versions of the fill colors)
const BORDER_COLORS = CHART_COLORS.map(color => 
  color.replace('0.8', '1')
);

export default function PollResultChart({ options, title = 'Poll Results' }: PollResultChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Prepare data for the chart
  const chartData = {
    labels: options.map(option => option.text),
    datasets: [
      {
        data: options.map(option => option.votes),
        backgroundColor: CHART_COLORS.slice(0, options.length),
        borderColor: BORDER_COLORS.slice(0, options.length),
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} votes (${percentage}%)`;
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
  };

  return (
    <div className="w-full max-w-md mx-auto my-6">
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
}