import { verifyToken } from '../utils/jwtUtils.js';
export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded; // Attach user data to the request object
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
