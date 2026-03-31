import React, { useState } from 'react';
import { loyaltyService } from '../services/api';

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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
                <div className="bg-[var(--color-primary)]/10 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Promo Code Validator</h2>
                    <p className="text-sm text-gray-500">Check if a coupon is valid and applicable.</p>
                </div>
            </div>

            <form onSubmit={handleValidate} className="flex flex-col gap-3 mt-2">
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                    <input
                        id="code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all"
                        placeholder="e.g. SUMMER50"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !code}
                    className="mt-2 w-full bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                    {loading ? (
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : 'Validate Code'}
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

export default PromoCodeValidator;
