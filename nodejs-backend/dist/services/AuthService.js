import { generateToken } from '../utils/jwtUtils.js';
import User from '../models/User.js';
export const registerUser = async (username, email, password) => {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }
    const user = await User.create({ username, email, password });
    if (!user.id)
        throw new Error('User id doesnt exists');
    const token = generateToken(user.id);
    return { user: { id: user.id, username: user.username, email: user.email }, token };
};
export const loginUser = async (email, password) => {
    const user = await User.findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isValidPassword = await User.validatePassword(user, password);
    if (!isValidPassword) {
        throw new Error('Invalid email or password');
    }
    if (!user.id)
        throw new Error('User id doesnt exists');
    const token = generateToken(user.id);
    return { user: { id: user.id, username: user.username, email: user.email }, token };
};
