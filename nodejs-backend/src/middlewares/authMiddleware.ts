import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils.js';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ message: 'No token provided' })
        return;
    }
    try {
        const decoded = verifyToken(token as string);
        (req as any).user = decoded; // Attach user data to the request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};