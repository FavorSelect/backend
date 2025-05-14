
# 📦 FavorSelect - Backend Server

This is the backend server for **FavorSelect**, an e-commerce platform. It is built with **Node.js**, **Express**, **MySQL**, and integrates third-party services like **AWS S3**, **Twilio**, and **Upstash Redis**.

---

## 🚀 Features

- JWT-based authentication for users and sellers
- Secure email and phone OTP verification
- AWS S3 integration for image uploads
- Redis-based cache/session management with Upstash
- Twilio SMS integration
- Social login support: Google, Facebook, Twitter
- Full admin, seller, and user API segregation
- Role-based access control (admin, admin+, superadmin)
- Product management, wishlist, reviews, carts, orders, and more

---

## 📁 Project Structure

```
favorselect-backend/
├── authMiddleware/           # Auth and role-based middleware
├── authService/              # Auth logic and utilities
├── awsS3Connection/          # AWS S3 integration
├── config/                   # Configuration files
├── controllers/              # Business logic
├── emailService/             # Email sending logic
├── membershipMiddleware/     # Middleware for membership plans
├── models/                   # Sequelize models
├── mysqlConnection/          # MySQL connection setup
├── public/                   # Public assets (if any)
├── redisService/             # Redis/Upstash configuration
├── routes/                   # API route handlers
│   ├── authRoute/            # Authentication (user, seller)
│   ├── profileRoute/         # Profiles (user, seller)
│   ├── sellerRoute/          # Seller-specific routes
│   ├── adminRoute/           # Admin-level routes
│   ├── cartRoute/            # Cart operations
│   ├── addressRoute/         # User address handling
│   ├── wishlistRoute/        # Wishlist management
│   ├── reviewRoute/          # Reviews and ratings
│   ├── reviewLikeRoute/      # Likes on reviews
│   ├── orderRoute/           # Orders API
│   ├── advertisementRoute/   # Homepage banner ads
├── schedular/                # Cron jobs (e.g., seller membership expiry)
├── twilioService/            # SMS functionality
├── .env                      # Environment config
├── .gitignore               
├── package.json             
├── README.md                
├── server.js                 # Main server entrypoint
└── vercel.json               # Deployment config
```

---

## 🛠️ Environment Setup

Create a `.env` file with the following template:

```env
PORT=8000
JWT_SECRET=your_jwt_secret

DB_HOST=localhost
DB_USER=root
DB_PASS=your_db_password
DB_NAME=favorselect

ADMIN_EMAIL=favorselect113@gmail.com

EMAIL=favorselect113@gmail.com
EMAIL_PASSWORD=your_app_password

AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_REGION=eu-north-1
AWS_BUCKET_NAME=favorselect113

UPSTASH_REDIS_REST_URL=https://dynamic-garfish-19824.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

FRONTEND_URL=http://localhost:3000
FRONTEND_URL_P=http://localhost:3000

NODE_ENV=development

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_google_redirect_uri

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_REDIRECT_URI=your_facebook_redirect_uri

TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_REDIRECT_URI=your_twitter_redirect_uri
```

---

## 🧪 API Endpoints Overview

### 🔐 Auth Routes
- `/api/auth/signup`
- `/api/auth/signin`
- `/api/auth/verify-email`
- `/api/auth/reset-password`
- `/api/auth/forget-password`
- Social Login:
  - `/api/auth/google`
  - `/api/auth/facebook`
  - `/api/auth/twitter`

### 👤 User Routes
(Require token)
- `/api/user/profile`
- `/api/user/cart`
- `/api/user/wishlist`
- `/api/user/review`
- `/api/user/order`
- `/api/user/address`

### 🛒 Seller Routes
(Require token)
- `/api/seller/profile`
- `/api/seller/product`
- `/api/seller/membership`

### 🛠 Admin Routes
(Require token + admin role)
- `/api/admin/product-approval`
- `/api/admin/seller-approval`
- `/api/admin/membership`
- `/api/admin/category`

### 📢 Advertisement Route
- `/api/advertisement` (Homepage banner logic)

---

## 💾 Installation

```bash
git clone <repo_url>
cd favorselect-backend
npm install
```

---

## 🚦 Running the Server

```bash
npm run dev
```

Server runs at: `http://localhost:8000` (or the port in `.env`)

---

## 🛡️ Security Notes

- Never commit your `.env` file
- Rotate sensitive credentials regularly (JWT, DB, Twilio, etc.)
- Use HTTPS in production

---

## 📬 Contact

📧 favorselect113@gmail.com

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
