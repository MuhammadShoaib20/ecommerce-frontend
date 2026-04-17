# ShopHub Frontend

React-based frontend for the ShopHub e-commerce platform, providing a modern shopping experience with product browsing, cart, wishlist, orders, reviews, and Stripe payment integration.

---

## 🚀 Live Demo

| | |
|---|---|
| **Frontend** | https://ecommerce-shop-hub-pied.vercel.app |
| **Backend API** | https://ecommerce-shophub-85lk.onrender.com |
| **GitHub** | https://github.com/MuhammadShoaib20/Ecommerce-ShopHub |

> **Demo Credentials**
> - **Admin:** `adminshoaib@shophub.com` / `admin123`
> - **Customer:** Register a new account to get started.

---

## ✨ Features

- 🔐 **User Authentication** — Register, login, profile update, password change (JWT)
- 🛍️ **Product Discovery** — Browse by category, search, price filters, pagination
- ❤️ **Wishlist** — Save favourite products (localStorage)
- 🛒 **Shopping Cart** — Add/remove items, adjust quantities, persistent storage
- 💳 **Checkout** — Stripe card payments or Cash on Delivery; mock payment fallback
- 📦 **Order Management** — View order history and track order status
- ⭐ **Product Reviews** — Authenticated users can leave ratings and comments
- 📞 **Contact Form** — Send messages directly to the team
- 📧 **Newsletter** — Subscribe for updates
- 🛡️ **Admin Panel** — Manage products, orders, and messages (protected routes)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite | Fast development and builds |
| Redux Toolkit | State management (auth, cart, wishlist, products, orders) |
| React Router v6 | Client-side routing |
| Tailwind CSS | Styling and custom animations |
| Stripe Elements | Secure card input and payment processing |
| Axios | HTTP requests to the backend |
| React Toastify | Notifications |

---

## 📁 Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components (ProductCard, CartItem, etc.)
│   ├── pages/           # Page components (Home, Shop, Checkout, etc.)
│   ├── redux/           # Redux slices (auth, cart, product, order, wishlist)
│   ├── services/        # API calls (axios instances)
│   ├── App.jsx          # Main app with routes
│   ├── main.jsx         # Entry point (Redux provider, auth restorer)
│   └── index.css        # Tailwind + base styles
├── .env.example
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/MuhammadShoaib20/Ecommerce-ShopHub.git
cd Ecommerce-ShopHub/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the `frontend/` folder (copy from `.env.example`):

```env
# For local backend
VITE_API_URL=http://localhost:5000/api
```

To connect to the live backend:

```env
VITE_API_URL=https://ecommerce-shophub-85lk.onrender.com/api
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Build for production

```bash
npm run build
```

The build output will be in the `dist/` folder.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (no trailing slash) |

---

## 🧪 Stripe Payments Testing

| Card Number | Result |
|---|---|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |

Use any future expiry date and any CVC.

> If the backend returns a dummy key or the key is missing, checkout falls back to a mock payment flow that always succeeds.

---

## 🚢 Deployment (Vercel)

1. Push your code to GitHub
2. Import the repository into Vercel
3. Set the environment variable: `VITE_API_URL=https://ecommerce-shophub-85lk.onrender.com/api`
4. Deploy

The included `vercel.json` ensures all routes are handled by `index.html`.

---

## 📌 Backend API Endpoints Used

| Section | Endpoints |
|---|---|
| **Auth** | `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`, `/api/auth/password/update` |
| **Products** | `/api/products`, `/api/product/:id`, `/api/admin/product/new`, `/api/admin/products` |
| **Orders** | `/api/order/new`, `/api/orders/me`, `/api/order/:id`, `/api/admin/orders` |
| **Payment** | `/api/payment/process`, `/api/stripeapikey` |
| **Contact** | `/api/contact`, `/api/admin/contacts` |
| **Newsletter** | `/api/newsletter/subscribe`, `/api/admin/newsletter/subscribers` |

For full backend details, see the [backend README](../backend/README.md).

---

## 👨‍💻 Author

**Muhammad Shoaib**

## 📄 License

MIT License

---

Happy Shopping! 🛒