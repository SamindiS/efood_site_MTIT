# eFoods System Run Instructions

To get the entire microservice architecture and all frontends running, you will need to open a separate terminal for each of the following components and execute the respective commands.

---

## 🏗️ 1. API Gateway
*The central entry point that routes all frontend requests to the correct backend microservice (runs on port 5010).*

**Directory:** `api-gateway`
**Command:**
```cmd
cd api-gateway
node index.js
```

---

## ⚙️ 2. Backend Microservices (6 Services)

### Restaurant Service (Port 5000)
**Directory:** `restaurant-management-service-neranda/backend`
**Command:**
```cmd
cd restaurant-management-service-neranda\backend
npm run dev
```

### Order Service (Port 5001)
**Directory:** `order-management-service-sasin/backend`
**Command:**
```cmd
cd order-management-service-sasin\backend
npm run dev
```

### Delivery Service (Port 5002)
**Directory:** `delivery-management-service-buwaneka/back`
**Command:**
```cmd
cd delivery-management-service-buwaneka\back
npm run dev
```

### Payment Service (Port 5003)
**Directory:** `payment-and-notification-management-service-ishara/backend`
**Command:**
```cmd
cd payment-and-notification-management-service-ishara\backend
npm run dev
```

### Review Service (Port 5004)
**Directory:** `efood_site_MTIT-keerthana`
**Command:**
```cmd
cd efood_site_MTIT-keerthana
node index.js
```

### Loyalty Service (Port 5005)
**Directory:** `Loyalty-management`
**Command:**
```cmd
cd Loyalty-management
node index.js
```

---

## 💻 3. Frontends (4 Applications)

### Main User E-Commerce Website
*The main customer-facing food ordering platform.*
**Directory:** `eFoods-frontend/efood-user-frontend`
**Command:**
```cmd
cd eFoods-frontend\efood-user-frontend
npm run dev
```

### Review/Feedback Platform
*The standalone frontend for viewing and submitting feedbacks (runs on port 5176).*
**Directory:** `efood_site_MTIT-keerthana/review-frontend`
**Command:**
```cmd
cd efood_site_MTIT-keerthana\review-frontend
npm run dev
```

### Admin Dashboard
*The central control panel for system administrators.*
**Directory:** `e-foods-admin/admin-frontend`
**Command:**
```cmd
cd e-foods-admin\admin-frontend
npm run dev
```

### Delivery Driver App
*The portal for drivers to view active deliveries and claim orders.*
**Directory:** `delivery-management-service-buwaneka/front/delivery`
**Command:**
```cmd
cd delivery-management-service-buwaneka\front\delivery
npm run dev
```

---

### 💡 Quick Tip
If you ever get an `EADDRINUSE: address already in use` error for any of these, it means you already have that specific service running in another terminal window or background process!
