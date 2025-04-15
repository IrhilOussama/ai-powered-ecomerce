import User from '../models/User.js';
import bcrypt from "bcrypt";
import { loginUser, registerUser } from '../services/AuthService.js';
import myDBPool from '../config/database.js';
import jwt from 'jsonwebtoken';
import { sendEmailVerification } from '../utils/sendResetEmail.js';
const JWT_SECRET = process.env.JWT_SECRET || "secret-key";
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
    }
    catch (error) {
        console.error("error fetching users: " + error);
        res.status(500).json({ error: "error fetching users" });
    }
};
export const getUser = async (req, res) => {
    try {
        const user = await User.getOne(req.params.id);
        if (user === undefined)
            res.json({ error: "no such user with this id" });
        res.json(user);
    }
    catch (error) {
        console.error("error fetching user: " + error);
        res.status(500).json({ error: "error fetching user" });
    }
};
export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({ error: "username, email and password are required" });
        }
        else {
            const message = await registerUser(username, email, password);
            res.status(201).json(message);
        }
    }
    catch (error) {
        console.error("error creating user: " + error);
        res.status(500).json({ error: "error creating user" });
    }
};
export const updateUser = async (req, res) => {
    try {
        const { username } = req.body;
        const id = req.params.id;
        if (!username) {
            res.status(400).json({ error: "username are required" });
        }
        else {
            const user = await User.update({ id, username });
            res.status(200).json({ msg: "user updated successfuly", user });
        }
    }
    catch (error) {
        console.error("error updating user: " + error);
        res.status(500).json({ error: "error updating user" });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const user = await User.delete(req.params.id);
        res.json({ msg: "user with id " + req.params.id + " has deleted successfuly" });
    }
    catch (error) {
        // console.error("error deleting user: " + error);
        res.status(500).json({ error: "error deleting user" });
    }
};
export const authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const message = await loginUser(email, password);
        res.json(message);
    }
    catch (error) {
        // console.error("error authenticating user: " + error);
        res.status(500).json({ error: "error authenticating user: " + error });
    }
};
export const getCurrentUser = async (req, res) => {
    res.json({ user: req.user });
};
export const changePassword = async (req, res) => {
    const userId = req.user ? req.user.userId : null; // from auth middleware
    const { currentPassword, newPassword } = req.body;
    try {
        // 1. Get the user from DB
        console.log(req.body);
        const result = await myDBPool.query('SELECT password FROM profile WHERE id = $1', [userId]);
        const user = result.rows[0];
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (!currentPassword || !newPassword) {
            res.status(404).json({ message: 'currentPassword and newPassword are not provided' });
            return;
        }
        // 2. Compare current password
        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid) {
            res.status(400).json({ message: 'Incorrect current password' });
            return;
        }
        // 3. Hash new password
        const hashed = await bcrypt.hash(newPassword, 10);
        // 4. Update password in DB
        await myDBPool.query('UPDATE profile SET password = $1 WHERE id = $2', [hashed, userId]);
        res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
export const requestEmailChange = async (req, res) => {
    const userId = req.user.userId; // from auth middleware
    const { newEmail } = req.body;
    try {
        if (!newEmail) {
            res.status(400).json({ message: "no email provided" });
            return;
        }
        // Optional: Check if newEmail is already in use
        const existing = await User.findUserByEmail(newEmail);
        if (existing) {
            res.status(400).json({ message: "Email already in use" });
            return;
        }
        const token = jwt.sign({ userId, newEmail }, JWT_SECRET, { expiresIn: "15m" });
        const verifyLink = `${process.env.FRONTEND_URL}/account/verify-new-email?token=${token}`;
        await sendEmailVerification(newEmail, verifyLink);
        res.status(200).json({ message: "Verification link sent to new email" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
export const confirmEmailChange = async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.getOne(decoded.userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (!user.id)
            return;
        await User.updateEmail(user.id, decoded.newEmail);
        res.status(200).json({ message: "Email updated successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ message: "Invalid or expired token" });
    }
};
