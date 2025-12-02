# 🌴 IslandRoots – Empowering Local Sri Lankan Artisans & Eco-Friendly Creators

IslandRoots is an innovative e-commerce marketplace designed to uplift **local Sri Lankan artisans, handmade creators, student entrepreneurs, and eco-friendly brands**.  
The platform connects mindful buyers with authentic, handmade and sustainable products — encouraging community growth, fair trade, and environmental responsibility.

---

## 🔥 Project Highlights
- Ethical marketplace promoting **local craftsmanship & sustainability**
- Smooth **shopping experience** for customers (guest + authenticated checkout)
- **Vendor portal** to manage products, orders, and payments
- **Admin dashboard** for platform management and analytics
- Mobile-first UI with clean & modern branding

---

## 📁 Repository Structure

island_roots/
├── frontend/   # Remix web application (client UI)
└── backend/    # Node/Express API + database + authentication

---

## 🧩 Tech Stack Overview

| Layer       | Technologies |
|-------------|--------------|
| Frontend    | RemixJS, React, TypeScript, TailwindCSS |
| Backend     | Node.js, Express.js, TypeScript |
| Database    | MySQL |
| Auth        | JWT-based authentication, bcrypt hashing |
| Deployment  | Apache2 / PM2 |

---

## 🚀 Core Features

### 👩‍🎨 For Vendors
- Product management (add / edit / delete)
- Order tracking
- Payments & earnings dashboard
- Inventory control

### 🛒 For Customers
- Browse by **categories, causes, regions & sustainability tags**
- Secure checkout with smart cart & order tracking
- Wishlist + favorites
- Rating & review system (coming soon)

### ⚙️ For Admin
- Vendor onboarding & verification
- Category and marketplace control
- Orders, payments & settlements
- Platform analytics & insights

---

## 🔐 Environment Variables

### Backend
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=

# Frontend
API_BASE_URL=
PUBLIC_API_BASE_URL=

---

## 🏁 Quick Start

### 1️⃣ Clone the repository
```bash
git clone [https://github.com/MenukaRisith/islandroots.git](https://github.com/MenukaRisith/islandroots.git)
cd island_roots
```

### 2️⃣ Backend setup
```
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### 3️⃣ Frontend setup

```
cd frontend
npm install
npm run dev
```

