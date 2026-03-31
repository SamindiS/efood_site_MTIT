const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Payment & Notification Service API',
            version: '1.0.0',
            description: 'API for processing payments via Stripe and managing notifications in the eFoods platform',
        },
        servers: [{ url: 'http://localhost:5003' }],
        paths: {
            '/api/payment/placeorder/{userId}': {
                get: { summary: 'Get checkout info for a user', tags: ['Payment'], parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Checkout info' } } },
            },
            '/api/payment/process': {
                post: { summary: 'Create Stripe checkout session', tags: ['Payment'], responses: { 200: { description: 'Checkout session created' } } },
            },
            '/api/payment/session/{sessionId}': {
                get: { summary: 'Get Stripe session details', tags: ['Payment'], parameters: [{ name: 'sessionId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Session details' } } },
            },
            '/api/payment/webhook': {
                post: { summary: 'Stripe webhook handler', tags: ['Payment'], responses: { 200: { description: 'Webhook processed' } } },
            },
        },
    },
    apis: [],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
