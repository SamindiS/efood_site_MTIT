import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import {
    Search,
    ShoppingBag,
    Clock,
    CheckCircle,
    XCircle,
    Trash2,
    User,
    CreditCard,
    Loader2,
    ChevronDown,
    ChevronLeft
} from 'lucide-react';

const RestaurantOrderManager = () => {
    const { id: restaurantId } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restaurantName, setRestaurantName] = useState('');

    useEffect(() => {
        fetchRestaurantDetails();
        fetchOrders();
    }, [restaurantId]);

    const fetchRestaurantDetails = async () => {
        try {
            // Reusing the restaurant API if available in utils/api.js, otherwise direct axios
            const res = await fetch(`http://localhost:5010/restaurant-service/api/restaurants/${restaurantId}`).then(r => r.json());
            setRestaurantName(res.name);
        } catch (err) {
            console.error("Failed to fetch restaurant details", err);
        }
    };

    const fetchOrders = async () => {
        try {
            // Using the restaurant-specific endpoint we created earlier
            const res = await orderAPI.get(`/orders/restaurant/${restaurantId}`);
            setOrders(res.data);
        } catch (err) {
            console.error("Failed to fetch restaurant orders", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await orderAPI.put(`/orders/${id}/status`, { status: newStatus });
            fetchOrders();
        } catch (err) {
            alert("Status update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this order record permanently?')) return;
        try {
            await orderAPI.delete(`/orders/${id}`);
            fetchOrders();
        } catch (err) {
            alert("Failed to delete order");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Delivering': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            default: return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/restaurants')}
                        className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl border border-slate-700 transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                            Order Ledger: <span className="text-orange-500">{restaurantName || 'Loading...'}</span>
                        </h1>
                        <p className="text-slate-400 mt-1">Specialized monitoring for this establishment's transactions.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-64 pl-10 pr-4 py-2 bg-[#1e293b] border border-slate-800 rounded-xl outline-none focus:ring-1 focus:ring-orange-500 text-white text-sm transition-all"
                        />
                    </div>
                    <button onClick={fetchOrders} className="p-2.5 bg-[#1e293b] text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-all">
                        <Clock className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#0f172a]/50 text-slate-500 text-[10px] uppercase tracking-widest font-black border-b border-slate-800">
                                <th className="px-6 py-5">Order Context</th>
                                <th className="px-6 py-5">Customer Details</th>
                                <th className="px-6 py-5">Financials</th>
                                <th className="px-6 py-5">Lifecycle Status</th>
                                <th className="px-6 py-5 text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-slate-800/10 transition-colors group">
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <ShoppingBag className="w-4 h-4 text-orange-500" />
                                                <span className="text-sm font-black text-white"># {order._id.substring(order._id.length - 8).toUpperCase()}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-500 font-bold ml-6 uppercase">{new Date(order.createdAt).toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                                                <User className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white leading-none mb-1">{order.user?.name || 'Guest User'}</p>
                                                <p className="text-xs text-slate-500">{order.user?.email || 'No email'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-white font-black text-lg">
                                                <CreditCard className="w-4 h-4 text-emerald-500" />
                                                $ {order.totalAmount?.toFixed(2)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${order.isPaid ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span>
                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{order.isPaid ? 'Paid in Full' : 'Awaiting Payment'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="relative group/status">
                                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-tighter w-fit cursor-default ${getStatusColor(order.status)}`}>
                                                {order.status || 'Pending'}
                                                <ChevronDown className="w-4 h-4 opacity-50" />
                                            </div>

                                            <div className="absolute top-full left-0 mt-2 w-40 bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-10 overflow-hidden">
                                                {['Pending', 'Confirmed', 'Delivering', 'Completed', 'Cancelled'].map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => handleStatusUpdate(order._id, s)}
                                                        className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border-b border-slate-800/50 last:border-0"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <button
                                            onClick={() => handleDelete(order._id)}
                                            className="p-3 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing Restaurant Orders...</p>
                    </div>
                )}

                {!loading && orders.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center">
                        <XCircle className="w-16 h-16 text-slate-800 mb-4" />
                        <h3 className="text-xl font-bold text-slate-500">No Orders Found</h3>
                        <p className="text-slate-600">This restaurant has not processed any orders yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantOrderManager;
