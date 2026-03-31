const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Loyalty & Promotions Service API',
            version: '1.0.0',
            description: 'API for managing promo codes and loyalty points in the eFoods platform',
        },
        servers: [{ url: 'http://localhost:5005' }],
        paths: {
            '/api/promo/validate': {
                post: { summary: 'Validate a promo code', tags: ['Promotions'], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { code: { type: 'string' } } } } } }, responses: { 200: { description: 'Coupon validated with discount' }, 400: { description: 'Invalid coupon' } } },
            },
            '/api/loyalty/points': {
                post: { summary: 'Add loyalty points to a user', tags: ['Loyalty'], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { userId: { type: 'string' }, points: { type: 'number' } } } } } }, responses: { 200: { description: 'Points added successfully' } } },
            },
        },
    },
    apis: [],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
