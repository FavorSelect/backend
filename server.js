require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoute = require('./route/authRoute');
const initDB = require('./models/allModelInit');

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

initDB(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
