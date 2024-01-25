// import express from 'express';
// import dotenv from 'dotenv';
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cookieParser = require('cookie-parser')
const database = require('./config/dbConnect')
const errorMiddleware = require('./middlewares/error')
// handle uncaught Exception
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: 'backend/config/config.env' })

// connection to database
database.db();

app.use(express.json());
app.use(cookieParser())

// import all routes
// import productRoutes from './routes/productRoute.js'
const productRoutes = require('./routes/productRoute')
const authRoutes = require('./routes/authRoute')
const orderRoutes = require('./routes/orderRoute')


app.use('/api/v1', productRoutes)
app.use('/api/v1', authRoutes)
app.use('/api/v1', orderRoutes)

//using error middleware
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port: ${process.env.PORT} IN ${process.env.NODE_ENV} mode.`)
});

// handle unhandled Rejection
// on() is a event loop handler

process.on("unhandlerRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});