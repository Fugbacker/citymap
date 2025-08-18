import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineChart = ({ data }) => {
  const labels = data.map((item) => item.applicationDate); // Метки оси X (даты)
  const costs = data.map((item) => item.cost); // Значения оси Y (стоимость)

  const chartData = {
    labels,
    datasets: [
      {
        label: "Стоимость", // Это основная подпись для всего графика
        data: costs,
        tension: 0.4, // Плавность линии
        pointRadius: 4, // Радиус точек на линии
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(72, 167, 40, 0.5)", // Зелёный цвет столбцов
        borderColor: "rgba(72, 167, 40, 0.5)", // Цвет границы столбцов
        borderWidth: 1, // Толщина границы
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Отключить легенду
      },
      // title: {
      //   display: true,
      //   text: "График изменения стоимости",
      // },
      tooltip: {
        callbacks: {
          label: function (context) {
            // Получение значения даты и стоимости
            const date = context.label;
            const value = context.raw.toLocaleString("ru-RU", {
              style: "currency",
              currency: "RUB",
            });

            return `Кадастровая стоимость на дату ${date}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: true, // Включаем или отключаем линии сетки
          lineWidth: 0.5, // Толщина линий сетки по оси X
          color: "#e0e0e0", // Цвет линий сетки
        },
        ticks: {
          maxTicksLimit: 5, // Максимальное количество подписей на оси X
          font: {
            size: 12, // Размер шрифта подписей
          },
        },
      },
      y: {
        grid: {
          display: true, // Включаем или отключаем линии сетки
          lineWidth: 0.5, // Толщина линий сетки по оси Y
          color: "#e0e0e0", // Цвет линий сетки
        },
        ticks: {
          stepSize: 10000, // Шаг между значениями на оси Y
          font: {
            size: 12, // Размер шрифта подписей
          },
        },
      },
    }
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
