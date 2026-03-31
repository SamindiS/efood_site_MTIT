import React, { useState } from 'react';
import { loyaltyService } from '../services/api';

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
            setPoints(''); // Reset points input after success
        } catch (err) {
            setError(err.message || 'Adding points failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
                <div className="bg-[var(--color-primary)]/10 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Loyalty Points</h2>
                    <p className="text-sm text-gray-500">Reward customers by adding loyalty points.</p>
                </div>
            </div>

            <form onSubmit={handleAddPoints} className="flex flex-col gap-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                        <input
                            id="userId"
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all"
                            placeholder="e.g. USER-12345"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">Points to Add</label>
                        <input
                            id="points"
                            type="number"
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all"
                            placeholder="e.g. 100"
                            min="1"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !userId || !points}
                    className="mt-2 w-full bg-[var(--color-accent)] hover:bg-black text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : 'Add Points'}
                </button>
            </form>

            {message && (
                <div className="mt-2 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm">
                    {message}
                </div>
            )}

            {error && (
                <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm">
                    {error}
                </div>
            )}
        </div>
    );
};

export default LoyaltyPointsManager;
