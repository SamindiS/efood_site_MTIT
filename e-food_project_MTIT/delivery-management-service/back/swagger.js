import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Delivery Management Service API',
            version: '1.0.0',
            description: 'API for managing delivery drivers and order assignments in the eFoods platform',
        },
        servers: [{ url: 'http://localhost:5002' }],
        paths: {
            '/api/drivers/register': {
                post: { summary: 'Register a new driver', tags: ['Drivers'], responses: { 201: { description: 'Driver registered' } } },
            },
            '/api/drivers/login': {
                post: { summary: 'Driver login', tags: ['Drivers'], responses: { 200: { description: 'Login successful' } } },
            },
            '/api/drivers/profile': {
                get: { summary: 'Get driver profile (protected)', tags: ['Drivers'], responses: { 200: { description: 'Driver profile' } } },
                put: { summary: 'Update driver profile (protected)', tags: ['Drivers'], responses: { 200: { description: 'Profile updated' } } },
            },
            '/api/drivers/orders': {
                get: { summary: 'Get orders for delivery', tags: ['Delivery Orders'], responses: { 200: { description: 'List of orders' } } },
            },
            '/api/drivers/orders/{id}': {
                delete: { summary: 'Delete a delivery order', tags: ['Delivery Orders'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Order deleted' } } },
            },
            '/api/drivers/restaurants/{id}/address': {
                get: { summary: 'Get restaurant address', tags: ['Restaurants'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Restaurant address' } } },
            },
            '/api/drivers': {
                get: { summary: 'Get all drivers (protected)', tags: ['Drivers'], responses: { 200: { description: 'List of drivers' } } },
                post: { summary: 'Create a driver (protected)', tags: ['Drivers'], responses: { 201: { description: 'Driver created' } } },
            },
            '/api/drivers/{id}': {
                get: { summary: 'Get driver by ID (protected)', tags: ['Drivers'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Driver details' } } },
                put: { summary: 'Update driver (protected)', tags: ['Drivers'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Driver updated' } } },
                delete: { summary: 'Delete driver (protected)', tags: ['Drivers'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Driver deleted' } } },
            },
        },
    },
    apis: [],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
