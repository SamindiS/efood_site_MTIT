# 🍔 eFoods: Cloud-Native Food Ordering & Delivery System

A robust, scalable microservices architecture built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). This platform provides a seamless experience for customers, restaurants, and delivery agents to interact through independently deployable services, all unified by a central **API Gateway**.

---

## 🚀 Key Features

*   **Microservices Architecture**: Modular services for Auth, Menu, Orders, Payments, and Delivery.
*   **Centralized API Gateway**: Unified entry point on port **5010** for all frontend-to-backend communication.
*   **Integrated Documentation**: Access all microservice API specs from a single **Swagger UI** dashboard.
*   **Built-in Feedback System**: Integrated review and rating platform accessible at `/review`.
*   **Modern Admin Dashboard**: Powerful control panel for system-wide configuration.
*   **Delivery Driver Portal**: Real-time order management for riders.

---

## 🛠️ Prerequisites

*   **Node.js & npm**: [Download Node.js](https://nodejs.org/) (Version 18+ recommended)
*   **Git**: [Download Git](https://git-scm.com/)
*   **MongoDB Atlas**: Active cluster for database storage.

---

## 🏗️ Getting Started (Local Setup)

To run the entire ecosystem locally, you will need to start the **API Gateway**, all **Backend Services**, and the **Frontends** in separate terminal windows.

### 1. Unified API Access (The Gateway)
The Gateway routes all requests to the correct microservice.
*   **Directory**: `api-gateway`
*   **Command**: `npm run dev`
*   **Public URL**: `http://localhost:5010`

👉 **Centralized API Docs (Swagger)**: **[http://localhost:5010/api-docs](http://localhost:5010/api-docs)**

---

### 2. Backend Microservices (Core Logic)

| Service | Port | Directory | Command |
| :--- | :--- | :--- | :--- |
| **Restaurant Service** | 5000 | `restaurant-management-service/backend` | `npm run dev` |
| **Order Service** | 5001 | `order-management-service/backend` | `npm run dev` |
| **Delivery Service** | 5002 | `delivery-management-service/back` | `npm run dev` |
| **Payment Service** | 5003 | `payment-and-notification-management-service/backend` | `npm run dev` |
| **Review Service** | 5004 | `review-management` | `node index.js` |
| **Loyalty Service** | 5005 | `Loyalty-management` | `node index.js` |

---

### 3. Frontend Applications

| Application | Description | Directory |
| :--- | :--- | :--- |
| **Main User Frontend** | E-commerce platform for customers | `eFoods-frontend/efood-user-frontend` |
| **Admin Dashboard** | Central control panel for admins | `e-foods-admin/admin-frontend` |
| **Delivery Driver App** | Portal for riders to claim deliveries | `delivery-management-service/front/delivery` |

**To run any frontend:**
```cmd
cd <directory>
npm install
npm run dev
```

---

## 🔑 Environment Configuration

Each service requires a `.env` file in its folder. Ensure the following variables are configured:

```env
# Database URIs
orderServiceDB_MONGO_URI=mongodb+srv://...
restaurantServiceDB_MONGO_URI=mongodb+srv://...
# Auth & Security
JWT_SECRET=your_secret_key
# Gateway Routing
API_GATEWAY_URL=http://localhost:5010
```

---

## 💡 Troubleshooting & Common Issues

### 1. Port Conflicts (`EADDRINUSE`)
If a service fails to start with `address already in use`, it means another process is still using that port.
*   **Solution**: Kill the process on the port using the terminal:
    ```powershell
    netstat -ano | findstr :<PORT_NUMBER>
    taskkill /F /PID <PID_FROM_NETSTAT>
    ```

### 2. MongoDB Connection Timeout
If you see `ETIMEOUT` or `queryTxt` errors:
*   **Solution**: Ensure your current IP address is whitelisted in your **MongoDB Atlas** Project settings under "Network Access".

---

🛠️ Developed as a group project for **MTIT Microservices Architecture**. Let's build the future of food delivery!
