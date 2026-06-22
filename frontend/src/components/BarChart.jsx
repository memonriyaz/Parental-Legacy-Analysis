import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function BarChart({ factors }) {
  const data = {
    labels: factors.map((f) => f.factor),

    datasets: [
      {
        label: "Mother",
        data: factors.map((f) => f.mother),
        backgroundColor: "#fb7185",
        borderRadius: 6,
      },
      {
        label: "Father",
        data: factors.map((f) => f.father),
        backgroundColor: "#38bdf8",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: "#cbd5e1",
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
        },
        grid: {
          color: "#1e293b",
        },
      },

      y: {
        ticks: {
          color: "#94a3b8",
        },
        grid: {
          color: "#1e293b",
        },
      },
    },
  };

  return (
    <div className="h-[360px]">
      <Bar data={data} options={options} />
    </div>
  );
}

export default BarChart;
