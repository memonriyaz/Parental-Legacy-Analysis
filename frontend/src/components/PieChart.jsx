import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ motherTotal, fatherTotal }) {
  const data = {
    labels: ["Mother", "Father"],

    datasets: [
      {
        data: [motherTotal, fatherTotal],
        backgroundColor: ["#fb7185", "#38bdf8"],
        borderColor: "#0f172a",
        borderWidth: 3,
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
          font: {
            size: 13,
          },
        },
      },
    },
  };

  return (
    <div className="h-[360px]">
      <Pie data={data} options={options} />
    </div>
  );
}

export default PieChart;
