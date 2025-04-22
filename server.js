require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const initDB = require('./config/dbInit');

//route
const authRoute = require('./route/authRoute');
const userProfileRoute = require('./route/userProfileRoute')

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(cookieParser());

// const cors = require('cors');
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

app.use('/api/auth', authRoute);
app.use('/api/profile',userProfileRoute)

initDB(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
