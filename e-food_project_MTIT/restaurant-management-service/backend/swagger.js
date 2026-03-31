const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Restaurant Management Service API',
            version: '1.0.0',
            description: 'API for managing restaurants and menu items in the eFoods platform',
        },
        servers: [{ url: 'http://localhost:5000' }],
        paths: {
            '/api/restaurants': {
                get: { summary: 'Get all restaurants', tags: ['Restaurants'], responses: { 200: { description: 'List of restaurants' } } },
                post: { summary: 'Create a restaurant', tags: ['Restaurants'], responses: { 201: { description: 'Restaurant created' } } },
            },
            '/api/restaurants/register': {
                post: { summary: 'Register a new restaurant', tags: ['Restaurants'], responses: { 201: { description: 'Restaurant registered' } } },
            },
            '/api/restaurants/login': {
                post: { summary: 'Restaurant login', tags: ['Restaurants'], responses: { 200: { description: 'Login successful' } } },
            },
            '/api/restaurants/me': {
                get: { summary: 'Get logged-in restaurant profile', tags: ['Restaurants'], responses: { 200: { description: 'Restaurant profile' } } },
            },
            '/api/restaurants/update': {
                put: { summary: 'Update logged-in restaurant', tags: ['Restaurants'], responses: { 200: { description: 'Restaurant updated' } } },
            },
            '/api/restaurants/{id}': {
                get: { summary: 'Get restaurant by ID', tags: ['Restaurants'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Restaurant details' } } },
                put: { summary: 'Update restaurant by ID', tags: ['Restaurants'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Restaurant updated' } } },
                delete: { summary: 'Delete restaurant by ID', tags: ['Restaurants'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Restaurant deleted' } } },
            },
            '/api/restaurants/{id}/availability': {
                put: { summary: 'Toggle restaurant availability', tags: ['Restaurants'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Availability toggled' } } },
            },
            '/api/menu': {
                get: { summary: 'Get all menu items', tags: ['Menu Items'], responses: { 200: { description: 'List of menu items' } } },
                post: { summary: 'Create a menu item', tags: ['Menu Items'], responses: { 201: { description: 'Menu item created' } } },
            },
            '/api/menu/{id}': {
                get: { summary: 'Get menu item by ID', tags: ['Menu Items'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Menu item details' } } },
                put: { summary: 'Update menu item', tags: ['Menu Items'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Menu item updated' } } },
                delete: { summary: 'Delete menu item', tags: ['Menu Items'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Menu item deleted' } } },
            },
        },
    },
    apis: [],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
