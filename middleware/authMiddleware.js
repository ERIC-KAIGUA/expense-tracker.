import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";

console.log('=== JWT MIDDLEWARE DEBUG ===');
console.log('process.env.JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY);
console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('JWT')));
console.log('============================');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
console.log('JWT_SECRET_KEY:', JWT_SECRET_KEY);
console.log('Auth Middleware Secret:', JWT_SECRET_KEY);

export default function(req, res, next) {
    // 1. Get token from header
    const token = req.header('x-auth-token'); 
      console.log('Token received:', token ? 'YES' : 'NO');
    console.log('Token value:', token)

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
         console.log('JWT_SECRET_KEY exists:', !!JWT_SECRET_KEY);
        console.log('JWT_SECRET_KEY length:', JWT_SECRET_KEY ? JWT_SECRET_KEY.length :'undefined');
        // 2. Verify token
        // jwt.verify(token, secretOrPublicKey, [options, callback])
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        console.log('Decoded token:', decoded);
        // 3. Attach user from token payload to the request object
        // The 'user' object here is what we put in the payload during login
        req.user = decoded.user; // e.g., req.user = { id: 'someUserId' }
        
        // 4. Proceed to the next middleware/route handler
        next();

    } catch (err) {
        // Token is not valid (e.g., expired, tampered with, invalid signature)
        console.error('JWT Verification Error:', err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};