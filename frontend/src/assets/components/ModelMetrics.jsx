import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ✅ Register required chart components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function ModelMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [featureImportance, setFeatureImportance] = useState(null);

  useEffect(() => {
    // Fetch model metrics
    axios
      .get("http://localhost:5000/metrics")
      .then((res) => {
        setMetrics(res.data);
      })
      .catch(console.error);

    // Fetch feature importance
    axios
      .get("http://localhost:5000/importance")
      .then((res) => setFeatureImportance(res.data))
      .catch(console.error);
  }, []);

  if (!metrics || !featureImportance) return <div>Loading...</div>;

  const chartData = {
    labels: Object.keys(featureImportance),
    datasets: [
      {
        label: "Feature Importance",
        data: Object.values(featureImportance),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Feature Importance",
      },
    },
    scales: {
      x: {
        type: "category", // this is what triggered the error if not registered
        title: {
          display: true,
          text: "Features",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Importance",
        },
      },
    },
  };

  return (
    <div className="mt-4">
      <h4>Model Performance</h4>
      <p>
        <strong>R²:</strong>{" "}
        {metrics.R2_Score !== undefined
          ? metrics.R2_Score.toFixed(3)
          : "Not available"}
      </p>
      <p>
        <strong>RMSE:</strong>{" "}
        {metrics.RMSE !== undefined ? metrics.RMSE.toLocaleString() : "N/A"}
      </p>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}
