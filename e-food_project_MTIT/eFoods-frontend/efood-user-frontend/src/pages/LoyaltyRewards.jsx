import React, { useState } from 'react';
import { loyaltyService } from '../services/loyalty';

const PromoCodeValidator = () => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleValidate = async (e) => {
        e.preventDefault();
        if (!code) return;

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const result = await loyaltyService.validatePromo(code);
            setMessage(`Success: ${result.message}. Discount: ${result.discount}%`);
        } catch (err) {
            setError(err.message || 'Validation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-[#1F7D53]/10 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-[#1F7D53]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Promo Code Validator</h2>
                    <p className="text-sm text-gray-500">Check if a coupon is valid and applicable.</p>
                </div>
            </div>

            <form onSubmit={handleValidate} className="flex flex-col gap-3 mt-2">
                <div>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1F7D53]"
                        placeholder="e.g. SUMMER50"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !code}
                    className="w-full bg-[#1F7D53] hover:bg-[#255F38] text-white font-medium py-2.5 px-4 rounded-lg flex justify-center items-center disabled:opacity-70"
                >
                    {loading ? 'Validating...' : 'Validate Code'}
                </button>
            </form>

            {message && <div className="mt-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}
            {error && <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        </div>
    );
};

const LoyaltyPointsManager = () => {
    const [userId, setUserId] = useState('');
    const [points, setPoints] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddPoints = async (e) => {
        e.preventDefault();
        if (!userId || !points) return;

        setLoading(true);
        setMessage('');
        setError('');

        try {
            const result = await loyaltyService.addLoyaltyPoints(userId, points);
            setMessage(`Success: ${result.message}. Total Points: ${result.totalPoints}`);
        } catch (err) {
            setError(err.message || 'Adding points failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-[#1F7D53]/10 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-[#1F7D53]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Loyalty Points</h2>
                    <p className="text-sm text-gray-500">Reward customers by adding loyalty points.</p>
                </div>
            </div>

            <form onSubmit={handleAddPoints} className="flex flex-col gap-4 mt-2">
                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1F7D53]"
                        placeholder="User ID (e.g. USER-12345)"
                        required
                    />
                    <input
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#1F7D53]"
                        placeholder="Points to Add (e.g. 100)"
                        min="1"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !userId || !points}
                    className="w-full bg-[#18230F] hover:bg-black text-white font-medium py-2.5 px-4 rounded-lg flex justify-center items-center disabled:opacity-70"
                >
                    {loading ? 'Adding...' : 'Add Points'}
                </button>
            </form>

            {message && <div className="mt-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{message}</div>}
            {error && <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        </div>
    );
};

function LoyaltyRewards() {
    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <div className="bg-[#1F7D53] text-white py-12 px-6">
                <div className="max-w-5xl mx-auto flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">Rewards & Promotions</h1>
                    <p className="text-white/80">Manage your loyalty points and check promo codes easily.</p>
                </div>
            </div>
            <div className="max-w-5xl mx-auto px-6 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <PromoCodeValidator />
                    <LoyaltyPointsManager />
                </div>
            </div>
        </div>
    );
}

export default LoyaltyRewards;
