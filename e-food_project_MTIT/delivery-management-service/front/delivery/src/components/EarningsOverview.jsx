import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const EarningsOverview = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState({
    total: 0,
    deliveries: 0,
    tips: 0,
    bonuses: 0,
    average: 0,
    history: []
  });

  useEffect(() => {
    // Load real earnings data from localStorage instead of mock data
    const loadEarningsData = () => {
      setLoading(true);
      try {
        // Get stored earnings data
        const storedData = localStorage.getItem('earningsData');
        if (!storedData) {
          setLoading(false);
          return; // No data available yet
        }

        const earningsData = JSON.parse(storedData);
        
        // Process earnings data based on selected period
        const processedData = processEarningsByPeriod(earningsData, period);
        setEarnings(processedData);
      } catch (err) {
        console.error('Failed to load earnings data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEarningsData();
  }, [period]);

  // Process raw earnings data into period-specific summaries
  const processEarningsByPeriod = (data, selectedPeriod) => {
    if (!data || !data.history || data.history.length === 0) {
      return {
        total: 0,
        deliveries: 0,
        tips: 0,
        bonuses: 0,
        average: 0,
        history: []
      };
    }

    // Sort history by date (newest first)
    const sortedHistory = [...data.history].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    const today = new Date();
    let filteredHistory = [];
    
    // Filter history based on period
    if (selectedPeriod === 'week') {
      // Get start of current week (Sunday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      filteredHistory = sortedHistory.filter(entry => 
        new Date(entry.date) >= startOfWeek
      );
    } else if (selectedPeriod === 'month') {
      // Get start of current month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      // Group by week for month view
      const weeklyData = groupByWeek(sortedHistory, startOfMonth);
      return {
        total: data.total,
        deliveries: data.deliveries,
        tips: data.tips,
        bonuses: data.bonuses,
        average: data.count > 0 ? data.total / data.count : 0,
        history: weeklyData
      };
    } else if (selectedPeriod === 'year') {
      // Get start of current year
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      
      // Group by month for year view
      const monthlyData = groupByMonth(sortedHistory, startOfYear);
      return {
        total: data.total,
        deliveries: data.deliveries,
        tips: data.tips,
        bonuses: data.bonuses,
        average: data.count > 0 ? data.total / data.count : 0,
        history: monthlyData
      };
    }

    // Calculate totals for the filtered period
    const periodTotal = filteredHistory.reduce((sum, entry) => sum + entry.amount, 0);
    const periodDeliveryCount = filteredHistory.reduce((sum, entry) => sum + entry.deliveries, 0);
    
    // For simplicity, estimate delivery pay and tips based on overall ratios
    const deliveryPayRatio = data.total > 0 ? data.deliveries / data.total : 0.6;
    const tipsRatio = data.total > 0 ? data.tips / data.total : 0.4;
    
    return {
      total: periodTotal,
      deliveries: periodTotal * deliveryPayRatio,
      tips: periodTotal * tipsRatio,
      bonuses: 0, // Assume no bonuses for simplicity
      average: periodDeliveryCount > 0 ? periodTotal / periodDeliveryCount : 0,
      history: filteredHistory
    };
  };

  // Group earnings by week for month view
  const groupByWeek = (history, startDate) => {
    const weeks = [];
    const weekMap = new Map();
    
    history.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate >= startDate) {
        // Calculate week number
        const weekStart = new Date(entryDate);
        weekStart.setDate(entryDate.getDate() - entryDate.getDay());
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weekMap.has(weekKey)) {
          weekMap.set(weekKey, {
            id: weeks.length + 1,
            date: `${weekStart.toISOString().split('T')[0]} to ${weekEnd.toISOString().split('T')[0]}`,
            amount: 0,
            deliveries: 0,
            status: 'Paid'
          });
        }
        
        const weekData = weekMap.get(weekKey);
        weekData.amount += entry.amount;
        weekData.deliveries += entry.deliveries;
      }
    });
    
    // Convert map to array and sort by date (newest first)
    return Array.from(weekMap.values()).sort((a, b) => {
      return new Date(b.date.split(' ')[0]) - new Date(a.date.split(' ')[0]);
    });
  };

  // Group earnings by month for year view
  const groupByMonth = (history, startDate) => {
    const months = [];
    const monthMap = new Map();
    
    history.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate >= startDate) {
        // Get month-year as key
        const monthKey = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthMap.has(monthKey)) {
          monthMap.set(monthKey, {
            id: months.length + 1,
            date: monthKey,
            amount: 0,
            deliveries: 0,
            status: 'Paid'
          });
        }
        
        const monthData = monthMap.get(monthKey);
        monthData.amount += entry.amount;
        monthData.deliveries += entry.deliveries;
      }
    });
    
    // Convert map to array and sort by date (newest first)
    return Array.from(monthMap.values()).sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  };

  const handlePeriodChange = (newPeriod) => {
    setLoading(true);
    setPeriod(newPeriod);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    // Check if the date is a range (for weekly view)
    if (dateString.includes(' to ')) {
      const [start, end] = dateString.split(' to ');
      const startDate = new Date(start);
      const endDate = new Date(end);
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    
    // For year period, only the month is provided (YYYY-MM format)
    if (dateString.length <= 7) {
      const [year, month] = dateString.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Earnings Overview</h2>
      
      {/* Period selector */}
      <div className="mb-6 flex bg-white rounded-lg overflow-hidden shadow p-1">
        <button 
          onClick={() => handlePeriodChange('week')}
          className={`flex-1 py-2 px-4 ${period === 'week' ? 'bg-blue-500 text-white font-medium rounded' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          This Week
        </button>
        <button 
          onClick={() => handlePeriodChange('month')}
          className={`flex-1 py-2 px-4 ${period === 'month' ? 'bg-blue-500 text-white font-medium rounded' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          This Month
        </button>
        <button 
          onClick={() => handlePeriodChange('year')}
          className={`flex-1 py-2 px-4 ${period === 'year' ? 'bg-blue-500 text-white font-medium rounded' : 'text-gray-700 hover:bg-gray-100'}`}
        >
          This Year
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Earnings Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Total Earnings</h3>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(earnings.total)}</p>
              <div className="mt-4 text-sm text-gray-500">
                {period === 'week' ? 'This week' : period === 'month' ? 'This month' : 'This year'}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Average Per Delivery</h3>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(earnings.average)}</p>
              <div className="mt-4 text-sm text-gray-500">
                Before platform fees
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Tips</h3>
              <p className="text-3xl font-bold text-purple-600">{formatCurrency(earnings.tips)}</p>
              <div className="mt-4 text-sm text-gray-500">
                {earnings.total > 0 ? ((earnings.tips / earnings.total) * 100).toFixed(1) : '0'}% of total earnings
              </div>
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
            <h3 className="text-lg font-medium p-4 border-b">Earnings Breakdown</h3>
            <div className="p-6">
              <div className="flex mb-4">
                <div className="w-1/3">
                  <div className="text-sm text-gray-500">Delivery Pay</div>
                  <div className="text-xl font-medium mt-1">{formatCurrency(earnings.deliveries)}</div>
                </div>
                <div className="w-1/3">
                  <div className="text-sm text-gray-500">Tips</div>
                  <div className="text-xl font-medium mt-1">{formatCurrency(earnings.tips)}</div>
                </div>
                <div className="w-1/3">
                  <div className="text-sm text-gray-500">Bonuses</div>
                  <div className="text-xl font-medium mt-1">{formatCurrency(earnings.bonuses)}</div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-4 flex rounded-full bg-gray-200">
                    {earnings.total > 0 && (
                      <>
                        <div 
                          style={{ width: `${(earnings.deliveries / earnings.total) * 100}%` }}
                          className="bg-blue-500 h-full"
                        ></div>
                        <div 
                          style={{ width: `${(earnings.tips / earnings.total) * 100}%` }}
                          className="bg-purple-500 h-full"
                        ></div>
                        <div 
                          style={{ width: `${(earnings.bonuses / earnings.total) * 100}%` }}
                          className="bg-green-500 h-full"
                        ></div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex text-xs mt-2 justify-between">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-blue-500 rounded-full mr-1"></div>
                    <span>Delivery Pay ({earnings.total > 0 ? ((earnings.deliveries / earnings.total) * 100).toFixed(1) : '0'}%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-purple-500 rounded-full mr-1"></div>
                    <span>Tips ({earnings.total > 0 ? ((earnings.tips / earnings.total) * 100).toFixed(1) : '0'}%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-green-500 rounded-full mr-1"></div>
                    <span>Bonuses ({earnings.total > 0 ? ((earnings.bonuses / earnings.total) * 100).toFixed(1) : '0'}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <h3 className="text-lg font-medium p-4 border-b flex justify-between items-center">
              <span>Payment History</span>
              <a href="#" className="text-sm text-blue-500 hover:underline">View All</a>
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deliveries
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {earnings.history.map((payment, index) => (
                    <tr key={payment.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.deliveries}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {earnings.history.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                No payment history available for this period
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EarningsOverview;