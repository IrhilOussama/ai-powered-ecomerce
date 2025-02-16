import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
export const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '6h' });
};
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
