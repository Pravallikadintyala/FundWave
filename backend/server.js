const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
connectDB();


const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/',(req, res)=>{
    res.send("Server is running");
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT} [${process.env.NODE_ENV}]`);
});