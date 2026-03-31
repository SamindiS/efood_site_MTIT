import React, { useEffect, useState } from 'react';
import { orderAPI } from '../utils/api';
import {
    CreditCard,
    Search,
    CheckCircle,
    XCircle,
    Clock,
    Loader2
} from 'lucide-react';

const PaymentManager = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            // Fetch actual orders to use as transaction ledger
            const res = await orderAPI.get('/orders').catch(() => ({ data: [] }));
            setTransactions(res.data.success !== undefined ? res.data.data : res.data);
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Payment Ledger</h1>
                    <p className="text-slate-400 mt-1">Monitor all eFoods transactions and settlements.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        className="w-80 pl-10 pr-4 py-3 bg-[#1e293b] border border-slate-800 rounded-2xl outline-none focus:ring-1 focus:ring-orange-500 text-white text-sm"
                    />
                </div>
            </div>

            <div className="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-[#0f172a]/50 text-slate-500 text-[10px] uppercase tracking-widest font-black border-b border-slate-800">
                                <th className="px-6 py-5">Transaction ID</th>
                                <th className="px-6 py-5">Amount</th>
                                <th className="px-6 py-5">Method</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {transactions.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-slate-500 font-bold">
                                        No recent transactions found.
                                    </td>
                                </tr>
                            )}
                            {transactions.map((tx) => (
                                <tr key={tx._id || tx.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-800 rounded-full">
                                                <CreditCard className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <span className="font-mono text-xs font-bold text-white">{tx._id || tx.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-lg font-black text-emerald-500">${tx.totalPrice?.toFixed(2) || tx.amount?.toFixed(2) || '0.00'}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold uppercase text-slate-300">
                                            {tx.paymentMethod || 'Credit Card'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            {(tx.paymentStatus === 'paid' || tx.status === 'completed') ? (
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                            ) : (tx.paymentStatus === 'failed' || tx.status === 'failed') ? (
                                                <XCircle className="w-4 h-4 text-red-500" />
                                            ) : (
                                                <Clock className="w-4 h-4 text-amber-500" />
                                            )}
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">{tx.paymentStatus || tx.status || 'Pending'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-medium text-slate-400">
                                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Just now'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {loading && (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4 border-t border-slate-800">
                        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Ledger...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentManager;
