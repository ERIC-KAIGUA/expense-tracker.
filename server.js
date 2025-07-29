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
.connect(process.env.MONGO_URI, {})
.then(()=>console.log("Connected to Database"))
.catch((err)=>console.log(`err:${err}`))


const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log('Server.js startup - JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);

if (!jwtSecret) {
    console.error('FATAL ERROR: JWT_SECRET_KEY is not defined. Please set it as an environment variable.');
    process.exit(1); 
}

app.use(express.json());
console.log('CORS Origin being used:', process.env.CLIENT_URL || "*");
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization","x-auth-token"],
}));
app.use(express.static(path.join(__dirname, '../frontend/express-tracker')))
app.use(userRouter)
app.use(incomeRouter)
app.use(expenseRouter)
app.use(dashboardRouter)

app.get('/', (req, res) => {
 res.sendFile(path.join(__dirname,'../frontend/express-tracker','index.html'))
});
app.listen(PORT,()=>{
    console.log(`Running on PORT ${PORT}`)
});