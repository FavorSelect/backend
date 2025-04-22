require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const initDB = require('./config/dbInit');

//route
const userAuthRoute = require('./routes/authRoute/userAuthRoute');
const userProfileRoute = require('./routes/profileRoute.js/userProfileRoute')

const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth/user', userAuthRoute);
app.use('/api/profile',userProfileRoute);

initDB(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
