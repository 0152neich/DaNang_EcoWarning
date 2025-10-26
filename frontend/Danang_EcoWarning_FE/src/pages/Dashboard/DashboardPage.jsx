import React from "react";
import "./DashboardPage.scss";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const rainfallData = {
  labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
  datasets: [
    {
      label: "Lượng mưa 2022 (mm)",
      data: [67, 5, 49, 367, 159, 100], 
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
    {
      label: "Lượng mưa Sơ bộ 2023 (mm)",
      data: [184, 88, 16, 23, 56, 120], 
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

const temperatureData = {
  labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
  datasets: [
    {
      label: "Nhiệt độ trung bình 2023 (°C)",
      data: [21.19, 23.68, 24.51, 27.98, 29.8], 
      backgroundColor: "rgba(255, 159, 64, 0.7)",
      barPercentage: 0.5,
    },
  ],
};

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <h1>Tổng quan Môi trường & Khí hậu Đà Nẵng</h1>

      <div className="chart-grid">
        <div className="chart-container">
          <h2>Biểu đồ Lượng mưa (mm)</h2>
          <Line
            data={rainfallData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>

        <div className="chart-container">
          <h2>Biểu đồ Nhiệt độ (°C)</h2>
          <Bar
            data={temperatureData}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
