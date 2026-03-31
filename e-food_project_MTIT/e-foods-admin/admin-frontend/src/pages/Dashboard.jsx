import React, { useEffect, useState } from 'react';
import { restaurantAPI, orderAPI } from '../utils/api';
import {
    Users,
    Utensils,
    ShoppingBag,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 shadow-xl hover:scale-[1.02] transition-all">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
        </div>
        <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        restaurants: 0,
        users: 0,
        orders: 0,
        revenue: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [resRest, resOrders] = await Promise.all([
                    restaurantAPI.get('/restaurants'),
                    orderAPI.get('/orders') // Assuming this endpoint exists or will be added
                ]);

                setStats({
                    restaurants: resRest.data.length || 0,
                    users: 0, // Need to implement user list endpoint
                    orders: resOrders.data?.length || 0,
                    revenue: 12540 // Mock data for now
                });
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-white">Dashboard Overview</h1>
                <p className="text-slate-400 mt-1">Real-time performance metrics across all services.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Restaurants" value={stats.restaurants} icon={Utensils} color="bg-orange-500" />
                <StatCard title="Active Users" value={stats.users} icon={Users} color="bg-blue-500" />
                <StatCard title="Total Orders" value={stats.orders} icon={ShoppingBag} color="bg-purple-500" />
                <StatCard title="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} icon={TrendingUp} color="bg-emerald-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Service Health</h2>
                    <div className="space-y-4">
                        {[
                            { name: 'Restaurant Service', port: 5000, status: 'online' },
                            { name: 'Order Service', port: 5001, status: 'online' },
                            { name: 'Delivery Service', port: 5002, status: 'online' },
                            { name: 'Payment Service', port: 5003, status: 'online' },
                        ].map((service) => (
                            <div key={service.port} className="flex items-center justify-between p-4 bg-[#0f172a] rounded-xl border border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${service.status === 'online' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 'bg-red-500'}`}></div>
                                    <span className="font-semibold text-white">{service.name}</span>
                                    <span className="text-xs text-slate-500 font-mono">Port {service.port}</span>
                                </div>
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#1e293b] rounded-2xl border border-slate-800 p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Security Logs</h2>
                    <div className="space-y-4">
                        {[
                            { msg: 'Admin Login', time: '2 mins ago', icon: Clock },
                            { msg: 'Price update rejected', time: '1 hour ago', icon: AlertCircle },
                            { msg: 'New restaurant pending', time: '3 hours ago', icon: AlertCircle },
                        ].map((log, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <log.icon className="w-5 h-5 text-slate-500 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-slate-300">{log.msg}</p>
                                    <p className="text-xs text-slate-500">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
