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


// routes import 
const categoryRoutes = require('./routes/categoryRoutes.js')

//routes declaration
app.use("/", categoryRoutes)

module.exports = app;