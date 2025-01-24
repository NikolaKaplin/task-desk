'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'


export const generateRandomData = (count: number) => {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 100));
};


export default function TaskCompletion() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d')
      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
            datasets: [
              {
                label: 'Выполненные задачи',
                data: generateRandomData(6),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                tension: 0.3,
                fill: true,
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: 'Выполнение задач за последние 6 месяцев',
                font: {
                  size: 16,
                  weight: 'bold',
                },
                color: '#34d399',
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  },
                  color: '#9ca3af',
                },
                grid: {
                  color: 'rgba(75, 85, 99, 0.3)',
                }
              },
              x: {
                ticks: {
                  color: '#9ca3af',
                },
                grid: {
                  color: 'rgba(75, 85, 99, 0.3)',
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
      <h3 className="text-2xl font-semibold mb-6 text-green-400">Статистика выполнения задач</h3>
      <div className="">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
}

