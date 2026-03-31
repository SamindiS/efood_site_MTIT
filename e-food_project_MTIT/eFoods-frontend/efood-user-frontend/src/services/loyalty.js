const BASE_URL = 'http://localhost:5005/api';

export const loyaltyService = {
    validatePromo: async (code) => {
        try {
            const response = await fetch(`${BASE_URL}/promo/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to validate promo code');
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    addLoyaltyPoints: async (userId, points) => {
        try {
            const response = await fetch(`${BASE_URL}/loyalty/points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, points: Number(points) }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add loyalty points');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
};
