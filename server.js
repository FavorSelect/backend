require('dotenv').config();
const express = require('express')
const {connectDB} = require('./config/dbConnection');
const cookieParser = require('cookie-parser');
//const cors = require('cors');

const authRoute = require('./route/authRoute');


const app = express();
PORT = process.env.PORT || 8001;
connectDB();

// app.use(cors({
//   origin:process.env.FRONTEND_URL,  
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],  
//   allowedHeaders: ['Content-Type', 'Authorization'],  
//   credentials:true                                                 
// }));

app.use(express.json());
app.use(cookieParser());



app.use('/api/auth',authRoute);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});