const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = 5010;

// Enable CORS
app.use(cors({
    origin: true,
    credentials: true,
}));

// ─── Service Registry ───────────────────────────────────────────
const services = [
    {
        name: 'Restaurant Service',
        route: '/restaurant-service',
        target: 'http://localhost:5000',
    },
    {
        name: 'Order Service',
        route: '/order-service',
        target: 'http://localhost:5001',
    },
    {
        name: 'Delivery Service',
        route: '/delivery-service',
        target: 'http://localhost:5002',
    },
    {
        name: 'Payment Service',
        route: '/payment-service',
        target: 'http://localhost:5003',
    },
    {
        name: 'Review Service',
        route: '/review-service',
        target: 'http://localhost:5004',
    },
    {
        name: 'Loyalty Service',
        route: '/loyalty-service',
        target: 'http://localhost:5005',
    },
];

// ─── Setup Proxy Routes ─────────────────────────────────────────
services.forEach(({ name, route, target }) => {
    app.use(
        route,
        createProxyMiddleware({
            target,
            changeOrigin: true,
            pathRewrite: { [`^${route}`]: '' },
            on: {
                proxyReq: (proxyReq, req) => {
                    console.log(`[Gateway] ${req.method} ${req.originalUrl} → ${target}${req.url}`);
                },
                error: (err, req, res) => {
                    console.error(`[Gateway] Error proxying to ${name}:`, err.message);
                    res.status(502).json({ error: `${name} is unavailable` });
                },
            },
        })
    );
});

// ─── Swagger UI ─────────────────────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// ─── Gateway Info Page ──────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        message: '🚀 eFoods API Gateway is running',
        services: services.map(s => ({
            name: s.name,
            gateway_url: `http://localhost:${PORT}${s.route}`,
            direct_url: s.target,
        })),
    });
});

// ─── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 eFoods API Gateway running on http://localhost:${PORT}\n`);
    console.log('Registered services:');
    services.forEach(s => {
        console.log(`  ${s.name}: http://localhost:${PORT}${s.route} → ${s.target}`);
    });
    console.log('');
});
