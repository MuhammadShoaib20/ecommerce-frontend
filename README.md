# 🛍️ ShopHub – Frontend

React-based frontend for the ShopHub e-commerce platform, providing a modern shopping experience with product browsing, cart, wishlist, orders, reviews, and Stripe payment integration.

---

## 🔗 Links

* 🚀 **Live Demo:**
  https://ecommerce-frontend-three-roan.vercel.app

* 🖥️ **Backend API:**
  https://ecommerce-backend-production-fe81.up.railway.app

* 🐙 **GitHub:**
  https://github.com/MuhammadShoaib20/Ecommerce-frontend

---

## 🔑 Demo Credentials

* **Admin:** `adminshoaib@shophub.com` / `admin123`
* **Customer:** Register a new account

---

## ✨ Features

* 🔐 Authentication (JWT)
* 🛍️ Product browsing, search, filters
* ❤️ Wishlist (localStorage)
* 🛒 Cart with persistent state
* 💳 Stripe + Cash on Delivery
* 📦 Order tracking
* ⭐ Reviews & ratings
* 📞 Contact form
* 📧 Newsletter subscription
* 🛡️ Admin panel (protected routes)

---

## 🛠️ Tech Stack

| Technology      | Purpose          |
| --------------- | ---------------- |
| React 18 + Vite | UI & build tool  |
| Redux Toolkit   | State management |
| React Router v6 | Routing          |
| Tailwind CSS    | Styling          |
| Stripe Elements | Payments         |
| Axios           | API calls        |
| React Toastify  | Notifications    |

---

## 📁 Project Structure

```bash
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
└── vite.config.js
```

---

## ⚙️ Installation

```bash
git clone https://github.com/MuhammadShoaib20/Ecommerce-frontend.git
cd Ecommerce-frontend
npm install
```

---

## 🔧 Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

👉 For production:

```env
VITE_API_URL=https://ecommerce-backend-production-fe81.up.railway.app/api
```

---

## ▶️ Run Project

```bash
npm run dev
```

App runs on: **http://localhost:5173**

---

## 🧪 Stripe Test Cards

| Card Number         | Result   |
| ------------------- | -------- |
| 4242 4242 4242 4242 | Success  |
| 4000 0000 0000 0002 | Declined |

---

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add env: `VITE_API_URL`
4. Deploy

---

## 📄 License

MIT License

---

<div align="center">
❤️ Built by Muhammad Shoaib
</div>
