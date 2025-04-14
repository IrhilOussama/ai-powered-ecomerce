import { verifyToken } from '../utils/jwtUtils.js';
export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    try {
        const decoded = verifyToken(token); // { userId: '44', iat: 1744655364, exp: 1744676964 }
        req.user = decoded; // Attach user data to the request object
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
