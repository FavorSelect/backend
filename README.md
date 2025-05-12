# 📦 FavorSelect - Backend Server

This is the backend server for FavorSelect,  Built with Node.js, Express,MYSQL, and cloud integrations such as AWS S3, Twilio, and Upstash Redis.

---

## 🚀 Features

- JWT-based user authentication
- Secure email and phone OTP verification
- AWS S3 for file uploads
- Upstash Redis for fast session or cache management
- Twilio for SMS services
- Environment-based configuration for secure deployment

---

## 📁 Project Structure

```
favorselect-backend/
├── authMiddleware/         # Middleware for authentication
├── authService/            # Authentication logic and services
├── awsS3Connection/        # AWS S3 setup and logic
├── config/                 # App configuration (DB, constants)
├── controllers/            # Route controllers
├── emailService/           # Email sending logic
├── membershipMiddleware/   # Middleware for membership control
├── models/                 # Database models
├── mysqlConnection/        # MySQL DB connection setup
├── node_modules/           
├── public/                 # Static files (if any)
├── redisService/           # Upstash Redis integration
├── routes/                 # Express routes
├── schedular/              # Scheduled tasks (cron jobs)
├── twilioService/          # Twilio SMS logic
├── .env                    # Environment variables
├── .gitignore              
├── package.json            
├── package-lock.json       
├── README.md               
├── server.js               # Server entry point
└── vercel.json             # Vercel deployment config

```

---

## 🛠️ Environment Setup

Create a `.env` file in the root directory and paste the following configuration:

```env
PORT=8000
JWT_SECRET=your_jwt_secret_here

DB_HOST=localhost
DB_USER=root
DB_PASS=your_db_password
DB_NAME=favourselect

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

FRONTEND_URL=" http://localhost:3000"
NODE_ENV = production


GOOGLE_CLIENT_ID = your_google_client_id
GOOGLE_CLIENT_SECRET = your_google_client_secret
GOOGLE_REDIRECT_URI = your_google_redirect_uri

FACEBOOK_APP_ID =your_facebook_app_id
FACEBOOK_APP_SECRET = your_facebook_app_secret
FACEBOOK_REDIRECT_URI = your_facebook_redirect_uri

TWITTER_CLIENT_ID = your_twitter_client_id
TWITTER_CLIENT_SECRET =your_twitter_client_secret
TWITTER_REDIRECT_URI = your_twitter_redirect_uri
```

⚠️ **Do not commit the `.env` file to version control!** Add it to `.gitignore`.

---

## 💾 Installation

```bash
git clone repo link
cd backend
npm install
```

---

## 🚦 Running the Server

```bash
npm start or npm run dev
```

Server will start on `http://localhost:8000` (or the port specified in `.env`).

---

## 🧪 Testing API

For User auth :
```bash
http://localhost:8000/api/auth/signup

http://localhost:8000/api/auth/verify-email

http://localhost:8000/api/auth/signin

http://localhost:8000/api/auth/reset-password

http://localhost:8000/api/auth/forget-password

```

You can use tools like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) to test the API endpoints.

---

## 🛡️ Security Notes

- Keep your `.env` file **private**
- Rotate AWS, Twilio, Redis, and DB credentials regularly
- Use HTTPS in production

---

## 📬 Contact

For any queries or support, reach out to:  
📧 **favorselect113@gmail.com**

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).
