# 🍔 Cloud-Native Food Ordering & Delivery System

This readme.txt explains how to deploy the Food Ordering & Delivery Platform developed using Microservices Architecture with Docker, Kubernetes, and React.js frontend.

**Cloud-Native Food Ordering & Delivery System** is a robust, scalable application built using a **Microservice Architecture** designed to streamline the end-to-end food ordering process. This system enables **restaurants**, **customers**, and **delivery agents** to interact seamlessly through independently deployable services.

Built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and fully **Dockerized** for cloud-native deployments, each microservice (e.g., Authentication, Menu, Orders, Payments, Notifications, Delivery) functions independently, allowing for high **fault tolerance** and **easy maintenance**.

### 🚀 Key Features
- Modular microservices architecture
- Dynamic menu and restaurant management
- Real-time order status and tracking
- Multiple payment gateway integration
- User role management (Admin, Customer, Restaurant, Rider)
- API Gateway with service discovery
- Docker & container orchestration support

This repository offers a modern, production-ready foundation to build full-featured cloud-native food delivery systems with speed, efficiency, and flexibility in mind.

---

## Prerequisites

- Node.js and npm installed
- Docker and Docker Compose installed
- Kubernetes (minikube or any cluster) installed
- Git installed

---

## Backend Microservices

1. Clone the repository:

   git clone https://github.com/SE-3Y1S-Microservices-Group-Project/efoods-online-food-ordering-and-delivery-management-system

2. Navigate to the project folder:

   cd efoods-online-food-ordering-and-delivery-management-system

3. Each services (Restaurant Management, Order Management, Delivery Management, Payment Management) has its own folders.

4. Build Docker images for each service:

   docker build -t restaurant-management-service-neranda ./restaurant-management-service-neranda
   docker build -t payment-and-notification-management-service-ishara ./payment-and-notification-management-service-ishara
   docker build -t order-management-service-sasin ./order-management-service-sasin
   docker build -t delivery-management-service-buwaneka ./delivery-management-service-buwaneka

5. Apply Kubernetes configuration files:

   kubectl apply -f k8s/restaurant-management-service-neranda.yaml
   kubectl apply -f k8s/payment-and-notification-management-service-ishara.yaml
   kubectl apply -f k8s/order-management-service-sasin.yaml
   kubectl apply -f k8s/delivery-management-service-buwaneka.yaml

6. Set up Database Services (MongoDB) by applying the relevant deployment YAMLs:

   kubectl apply -f k8s/database-deployment.yaml

7. Expose services using LoadBalancer.

---

## Frontend (React Web Client)

1. Navigate to the client folder:

   cd eFoods-frontend

2. Install dependencies:

   npm install

3. Start the frontend locally:

   npm run dev

(build a production version:)

   npm run build

4. Dockerize the frontend:

   docker build -t eFoods-frontend ./eFoods-frontend

5. Deploy frontend via Kubernetes:

   kubectl apply -f k8s/eFoods-frontend.yaml

---

## Environment Variables

Create a `.env` file in each service folder and client folder with necessary variables such as:

- DB_HOST
- DB_USER
- DB_PASSWORD
- API_GATEWAY_URL
- Payment gateway keys (e.g., Stripe, PayHere)

---

## Payment Integration Setup

- Configure payment gateway credentials (Stripe/PayHere/FriMi) in the environment variables.
- For sandbox testing, use provided test keys.

---

## SMS and Email Notifications

- Sign up for SMS/Email service (e.g., Twilio, SendGrid).
- Set API keys in environment variables.

---

## Accessing the Platform

- Open browser and access frontend via LoadBalancer IP / Ingress domain.
- Customers can browse restaurants, order food, track deliveries.

---

## Additional Notes

- Use `kubectl get pods`, `kubectl get services` to monitor deployment.
- In case of issues, check pod logs using:

   kubectl logs [pod-name]

---



🛠️ Contributions welcome. Let’s build the future of food delivery tech!
