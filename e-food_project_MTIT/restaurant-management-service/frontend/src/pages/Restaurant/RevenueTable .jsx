import { useEffect, useState } from 'react';
import { BarChart2 } from 'lucide-react';
import axios from 'axios';

const RevenueTable = () => {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRevenueData(res.data.revenueByDay || []);
    } catch (err) {
      console.error('Failed to load revenue data:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 flex items-center text-sky-700">
        <BarChart2 className="mr-2" /> Revenue (Last 7 Days)
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-sky-100 text-sky-700">
            <tr>
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Revenue (USD)</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.length > 0 ? (
              revenueData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border-b">{item.date}</td>
                  <td className="px-4 py-2 border-b font-medium text-green-700">
                    Rs. {parseFloat(item.amount).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-500">
                  No revenue data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueTable;
