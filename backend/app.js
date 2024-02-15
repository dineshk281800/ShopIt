// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import database from './config/dbConnect';
// import errorMiddleware from './middlewares/error';
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const cors = require("cors");
const database = require('./config/dbConnect.js')
const errorMiddleware = require('./middlewares/error.js')

const path = require("path");
// const { fileURLToPath } = require('url')

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const __dirname = fileURLToPath(path.dirname(import.meta.ur))
// handle uncaught Exception
process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});

if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: 'backend/config/config.env' })
}

// connection to database
database.db();

app.use(express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    },
}));
// app.use(cors({
//     credentials: true,
//     origin: true,
// }));
app.use(cors())
app.use(cookieParser())

// import all routes
// import productRoutes from './routes/productRoute.js'
const productRoutes = require('./routes/productRoute')
const authRoutes = require('./routes/authRoute')
const orderRoutes = require('./routes/orderRoute')
const paymentRoutes = require('./routes/paymentRoute')
const { fileURLToPath } = require('url')

app.use('/api/v1', productRoutes)
app.use('/api/v1', authRoutes)
app.use('/api/v1', orderRoutes)
app.use('/api/v1', paymentRoutes)

if (process.env.NODE_ENV === "PRODUCTION") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"))
    })
}
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