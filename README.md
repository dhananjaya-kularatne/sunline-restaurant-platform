# Sunline Restaurant Platform

A full-stack restaurant management platform built with Spring Boot and React.

## Team

| Name | Reg. No. | Email | Features |
|------|----------|-------|----------|
| Kularatne R.A.D | IT24103431 | it24103431@my.sliit.lk | User Management, Ratings Management & Smart Recommendations |
| Peiris M.D.D.P | IT24100532 | it24100532@my.sliit.lk | Order Management & Menu Management |
| Hettiarachchi S.S | IT24103438 | it24103438@my.sliit.lk | Support Management, Reservations Management & Admin Dashboard |
| Srinayaka S.P.B.M. | IT24103435 | it24103435@my.sliit.lk | Social Feed Management, AI Chatbot & Wishlist |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.2.2, Java 21, Spring Security + JWT |
| Database | MySQL 8+ |
| Frontend | React 18, Vite, TailwindCSS, React Router v6 |
| Auth | JWT (stateless), BCrypt password hashing |

## Features

- **Customer**: Browse menu, place orders, book tables, wishlist, social feed, ratings, chatbot support
- **Admin**: Dashboard (revenue/sales), user/menu/order/reservation/post/support management
- **Kitchen & Delivery**: Role-based dashboards for operational staff
- **Authentication**: Register, login, forgot/reset password via email

## Prerequisites

- Java 21+
- Node.js 18+
- MySQL 8+
- Maven 3.8+

## Setup

### 1. Database

MySQL will auto-create the `sunline_db` database on first run.

### 2. Backend

```bash
cd backend
# Copy the example config and fill in your values
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit application.properties with your DB password and mail credentials
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`.  
A default admin account (`admin@sunline.com` / `Admin@123!`) and sample menu items are seeded automatically.

### 3. Frontend

```bash
cd frontend
npm install
# Optional: copy .env.example to .env and set VITE_API_URL if needed
npm run dev
```

The frontend starts on `http://localhost:5173`.

## Available Scripts (Frontend)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format code with Prettier |

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sunline.com | Admin@123! |
