const express         =  require('express');
const cors            =  require('cors');
const cookieParser    =  require('cookie-parser');
const app             =  express()

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());
app.use(express.json({limit: "16kb"}))


// routes import 
const categoryRoutes = require('./routes/categoryRoutes.js')
const cryptocurrencyRoutes = require('./routes/cryptocurrencyRoutes.js')

//routes declaration
app.use("/", categoryRoutes)
app.use("/", cryptocurrencyRoutes)

module.exports = app;