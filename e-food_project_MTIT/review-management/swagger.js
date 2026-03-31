const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Review Service API',
            version: '1.0.0',
            description: 'API for managing restaurant reviews and ratings in the eFoods platform',
        },
        servers: [{ url: 'http://localhost:5004' }],
        paths: {
            '/api/reviews': {
                get: { summary: 'Get all reviews', tags: ['Reviews'], responses: { 200: { description: 'List of all reviews' } } },
                post: { summary: 'Add a new review', tags: ['Reviews'], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { userId: { type: 'string' }, restaurantId: { type: 'string' }, rating: { type: 'number' }, comment: { type: 'string' } } } } } }, responses: { 200: { description: 'Review added' } } },
            },
            '/api/reviews/{restaurantId}': {
                get: { summary: 'Get reviews by restaurant', tags: ['Reviews'], parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Reviews for restaurant' } } },
            },
            '/api/reviews/average/{restaurantId}': {
                get: { summary: 'Get average rating for restaurant', tags: ['Reviews'], parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Average rating' } } },
            },
        },
    },
    apis: [],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
