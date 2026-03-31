const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Order Management Service API',
            version: '1.0.0',
            description: 'API for user authentication, cart management, and order processing in the eFoods platform',
        },
        servers: [{ url: 'http://localhost:5001' }],
        paths: {
            '/api/auth/register': {
                post: { summary: 'Register a new user', tags: ['Authentication'], responses: { 201: { description: 'User registered' } } },
            },
            '/api/auth/login': {
                post: { summary: 'Login user', tags: ['Authentication'], responses: { 200: { description: 'Login successful' } } },
            },
            '/api/auth/logout': {
                post: { summary: 'Logout user', tags: ['Authentication'], responses: { 200: { description: 'Logged out' } } },
            },
            '/api/auth/users': {
                get: { summary: 'Get all users', tags: ['Authentication'], responses: { 200: { description: 'List of users' } } },
            },
            '/api/auth/user/{id}': {
                get: { summary: 'Get user by ID', tags: ['Authentication'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'User details' } } },
                put: { summary: 'Update user by ID', tags: ['Authentication'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'User updated' } } },
                delete: { summary: 'Delete user by ID', tags: ['Authentication'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'User deleted' } } },
            },
            '/api/cart': {
                post: { summary: 'Add item to cart', tags: ['Cart'], responses: { 200: { description: 'Item added' } } },
            },
            '/api/cart/{userId}': {
                get: { summary: 'Get cart items for user', tags: ['Cart'], parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Cart items' } } },
                put: { summary: 'Update item quantity', tags: ['Cart'], parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Quantity updated' } } },
            },
            '/api/cart/{userId}/{restaurantId}/{menuItemId}': {
                delete: { summary: 'Remove item from cart', tags: ['Cart'], parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }, { name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }, { name: 'menuItemId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Item removed' } } },
            },
            '/api/orders': {
                post: { summary: 'Place a new order', tags: ['Orders'], responses: { 201: { description: 'Order created' } } },
                get: { summary: 'Get all orders (admin)', tags: ['Orders'], responses: { 200: { description: 'List of orders' } } },
            },
            '/api/orders/{orderId}/pay': {
                put: { summary: 'Mark order as paid', tags: ['Orders'], parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Order marked as paid' } } },
            },
            '/api/orders/user/{userId}': {
                get: { summary: 'Get orders for a user', tags: ['Orders'], parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'User orders' } } },
            },
            '/api/orders/{orderId}/status': {
                put: { summary: 'Update order status', tags: ['Orders'], parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Status updated' } } },
            },
            '/api/orders/restaurant/{restaurantId}': {
                get: { summary: 'Get orders for a restaurant', tags: ['Orders'], parameters: [{ name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Restaurant orders' } } },
            },
            '/api/orders/{orderId}': {
                delete: { summary: 'Delete an order', tags: ['Orders'], parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Order deleted' } } },
            },
        },
    },
    apis: [],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
