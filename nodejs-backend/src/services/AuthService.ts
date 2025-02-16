import { generateToken } from '../utils/jwtUtils.js';
import User, { MyUser } from '../models/User.js';

export const registerUser = async (username: string, email: string, password: string) => {
    const existingUser: MyUser = await User.findUserByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }
    const user: MyUser = await User.create({username, email, password});
    if (!user.id) throw new Error('User id doesnt exists');
    const token = generateToken(user.id);
    return { user: {id: user.id, username: user.username, email: user.email}, token };
};

export const loginUser = async (email: string, password: string) => {
    const user: MyUser = await User.findUserByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isValidPassword = await User.validatePassword(user, password);
    if (!isValidPassword) {
        throw new Error('Invalid email or password');
    }
    if (!user.id) throw new Error('User id doesnt exists');
    const token = generateToken(user.id);
    return { user: {id: user.id, username: user.username, email: user.email}, token };
};