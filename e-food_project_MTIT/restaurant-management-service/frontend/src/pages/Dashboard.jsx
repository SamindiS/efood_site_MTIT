import React, { useEffect, useState } from 'react';
import Sidebar from '../components/SideBar';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    menuCount: 0,
    customerCount: 0,
    completedOrders: 0,
    cancelledOrders: 0
  });

  const [revenueByDay, setRevenueByDay] = useState([]);


  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const restaurantId = localStorage.getItem('restaurantId');
      const res = await axios.get(`http://localhost:5000/api/dashboard/stats?restaurantId=${restaurantId}`);
      setStats(res.data.stats);
      setRevenueByDay(res.data.revenueByDay);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  };
  

  const barChartData = {
    labels: revenueByDay.map(day => day.date),
    datasets: [
      {
        label: 'Revenue (USD)',
        data: revenueByDay.map(day => day.amount),
        backgroundColor: 'rgba(14, 165, 233, 0.6)',
        borderRadius: 8
      }
    ]
  };

  const doughnutData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [
          stats.completedOrders,
          stats.pendingOrders,
          stats.cancelledOrders
        ],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        hoverOffset: 6
      }
    ]
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <Sidebar />

      <div className="flex-1 p-6">
      <h1 className="text-4xl font-extrabold text-sky-800 mb-2 flex items-center gap-2">
        📊 Restaurant Dashboard
      </h1>
      <h2 className="text-2xl font-semibold text-green-700 mb-6">
        Welcome to <span className="font-bold text-green-900">{localStorage.getItem('restaurantName')}</span>
      </h2>


        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
          <StatCard title="📋 Menu Items" value={stats.menuCount} color="text-indigo-600" />
          <StatCard title="🛒 Today’s Orders" value={stats.todayOrders} color="text-sky-600" />
          <StatCard title="👥 Customers" value={stats.customerCount} color="text-purple-600" />
          <StatCard title="💰 Total Revenue" value={`USD ${stats.totalRevenue}`} color="text-green-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition">
            <h2 className="text-lg font-semibold text-sky-800 mb-4">💵 Revenue - Last 7 Days</h2>
            <Bar data={barChartData} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition">
            <h2 className="text-lg font-semibold text-sky-800 mb-4">📦 Order Status Overview</h2>
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transform hover:scale-[1.02] transition">
      <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}
