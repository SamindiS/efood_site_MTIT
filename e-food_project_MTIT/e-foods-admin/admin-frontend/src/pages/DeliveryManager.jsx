import React, { useEffect, useState } from 'react';
import { deliveryAPI } from '../utils/api';
import {
    Truck,
    Search,
    MapPin,
    Package,
    Loader2
} from 'lucide-react';

const DeliveryManager = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            // Fetch active deliveries from the delivery service
            const res = await deliveryAPI.get('/drivers/orders').catch(() => ({ data: { data: [] } }));
            setDeliveries(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch deliveries", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Fleet Command</h1>
                    <p className="text-slate-400 mt-1">Manage active shipments and analyze delivery trajectories.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search deliveries..."
                        className="w-80 pl-10 pr-4 py-3 bg-[#1e293b] border border-slate-800 rounded-2xl outline-none focus:ring-1 focus:ring-orange-500 text-white text-sm"
                    />
                </div>
            </div>

            <div className="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#0f172a]/50 text-slate-500 text-[10px] uppercase tracking-widest font-black border-b border-slate-800">
                                <th className="px-6 py-5">Shipment ID</th>
                                <th className="px-6 py-5">Customer & Items</th>
                                <th className="px-6 py-5">Destination Address</th>
                                <th className="px-6 py-5">Current Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {deliveries.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-16 text-center text-slate-500 font-bold">
                                        No active deliveries located.
                                    </td>
                                </tr>
                            )}
                            {deliveries.map((delivery) => (
                                <tr key={delivery._id || delivery.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                                <Package className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="font-mono text-sm font-bold text-white uppercase">{delivery._id?.substring(18) || delivery.id}</p>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">Assigned: {delivery.driverId || 'Pending'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1 text-slate-300">
                                            <span className="text-sm font-black text-white">{delivery.customerName || 'Guest User'}</span>
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{delivery.items?.length || 1} ITEM(S) | ${delivery.totalPrice?.toFixed(2) || '0.00'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                            <span className="text-sm font-bold max-w-[200px] truncate">{delivery.deliveryAddress || 'No Address Provided'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${delivery.deliveryStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                delivery.deliveryStatus === 'picked_up' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    delivery.deliveryStatus === 'accepted' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        'bg-slate-800 text-slate-400 border-slate-700'
                                            }`}>
                                            {delivery.deliveryStatus || 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {loading && (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4 border-t border-slate-800">
                        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Locating Fleet...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryManager;
