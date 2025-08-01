import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
console.log('JWT_SECRET_KEY loaded:', process.env.JWT_SECRET_KEY ? 'YES' : 'NO');
import express from 'express';
import cors from 'cors'
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose, { Mongoose } from 'mongoose';
import expenseRouter from "./expense/expenseRoute.js";
import incomeRouter from "./income/incomeRoute.js";
import userRouter from "./user/userRoute.js";
import dashboardRouter from "./dashboard/dashboardRoute.js";

const app = express()

const jwtSecret = process.env.JWT_SECRET_KEY;
mongoose
.connect(process.env.MONGO_URI,)
.then(()=>console.log("Connected to Database"))
.catch((err)=>console.log(`err:${err}`))


const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();
console.log('Server.js startup - JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);

if (!jwtSecret) {
    console.error('FATAL ERROR: JWT_SECRET_KEY is not defined. Please set it as an environment variable.');
    process.exit(1); 
}

app.use(express.json());
console.log('CORS Origin being used:', process.env.CLIENT_URL || "*");
app.use(cors({
    origin: (origin, callback) => {
    const allowedOrigins = ['https://expense-tracker-ec7u.onrender.com'];
    callback(null, allowedOrigins.includes(origin) ? origin : false);
  },
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization","x-auth-token"],
}));

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '/frontend/expense-tracker/dist')));
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api')) {
            res.sendFile(path.resolve(__dirname, 'frontend/expense-tracker', 'dist', 'index.html'));
        } else {
            next();
        }});    
}
app.use('/api',userRouter)
app.use('/api',incomeRouter)
app.use('/api',expenseRouter)
app.use('/api',dashboardRouter)


app.listen(PORT,()=>{
    console.log(`Running on PORT ${PORT}`)
});