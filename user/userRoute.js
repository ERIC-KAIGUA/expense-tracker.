import { Router } from "express";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import {User} from "../user/userSchema.js";
import auth from "../middleware/authMiddleware.js";


const router = Router();
dotenv.config();
const saltRounds = 10;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) {
    console.error('FATAL ERROR: JWT_SECRET_KEY is not defined. Please set it as an environment variable.');
    process.exit(1); 
}

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Log the incoming body to see what backend receives
        console.log('Received signup data:', req.body); // Add this for debugging

        // It's generally better to check for existing email for uniqueness
        const isExisting = await User.findOne({ email }); // <--- Change to email
        if (isExisting) {
            // Also send a proper error status for existing user
            return res.status(400).json({ msg: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = new User({
            fullName,
            email,
            password: hashedPassword
        });

        await user.save(); // <--- Add await here

        // Correct order: status then json
        return res.status(200).json({ msg: "Signup was successful" });

    } catch (err) {
        console.error('Error during signup:', err); // Use console.error for errors

        // Add more specific error handling for validation errors
        if (err.name === 'ValidationError') {
            const errors = {};
            // Iterate over the errors object provided by Mongoose
            for (let field in err.errors) {
                errors[field] = { message: err.errors[field].message };
            }
            return res.status(400).json({ errors, msg: 'Validation failed' });
        }

        // Generic server error
        res.status(500).send('Server Error');
    }
});

router.post('/login', async(req,res)=>{
    const {body:{email,password}} = req;
    
    console.log('=== LOGIN DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Email from request:', email);
    console.log('Password from request:', password ? 'PROVIDED' : 'NOT PROVIDED');
    
    try{
        // First, let's check if we can find ANY users in the database
        const allUsers = await User.find({});
        console.log('Total users in database:', allUsers.length);
        
        if (allUsers.length > 0) {
            console.log('Sample user from database:', {
                id: allUsers[0]._id,
                email: allUsers[0].email,
                // Don't log password for security
            });
        }
        
        // Now try to find the specific user
        console.log('Searching for user with email:', email);
        const user = await User.findOne({email: email});
        console.log('Found user:', user ? 'YES' : 'NO');
        
        if (user) {
            console.log('User details:', {
                id: user._id,
                email: user.email,
                hasPassword: !!user.password
            });
        }
        
        // Try case-insensitive search as backup
        const userCaseInsensitive = await User.findOne({
            email: { $regex: new RegExp('^' + email + '$', 'i') }
        });
        console.log('Case-insensitive search result:', userCaseInsensitive ? 'FOUND' : 'NOT FOUND');
        
        if(!user){
            return res.status(400).json({msg:"User not found. Please Sign Up"});
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isPasswordValid);
        
        if(!isPasswordValid){
            return res.status(401).json({msg:"Invalid credentials"});
        }
        
        const payload = {
            user: {
                id: user._id // Use _id instead of id for MongoDB
            }
        };
        
        console.log('Creating JWT with payload:', payload);
        console.log('JWT Secret exists:', !!process.env.JWT_SECRET_KEY);
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error('JWT Sign Error:', err);
                    return res.status(500).json({ msg: "Token generation failed" });
                }
                console.log('Token generated successfully');
                return res.status(201).json({msg:"Login Successful", token:token});
            }
        );
        
    }catch(err){
        console.log('ERR:', err);
        return res.status(500).json({msg:"Server error"});
    }
});
export default router