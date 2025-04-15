import passport from "passport";
import { generateToken } from "../utils/jwtUtils.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from 'bcrypt';
import { sendResetEmail } from "../utils/sendResetEmail.js";
export const handleGoogleRoute = passport.authenticate('google', { scope: ['profile', 'email'] });
export const handleGoogleAuthRoute = async (req, res, next) => {
    // Use passport to handle the callback. We disable sessions.
    passport.authenticate('google', { session: false }, (err, user, info) => {
        console.log(3232);
        if (err || !user) {
            // Redirect to a login page on the frontend with an error message.
            const errorMessage = err ? err.message : 'Authentication Failed';
            console.log("abc");
            return res.redirect(`${process.env.FRONTEND_URL}/account?error=${encodeURIComponent(errorMessage)}`);
        }
        // Generate a JWT token for the authenticated user.
        const token = generateToken(user.id);
        console.log("xyz");
        // Redirect the user back to the frontend, passing the token as a query parameter.
        return res.redirect(`${process.env.FRONTEND_URL}/api/auth/callback?token=${token}`);
    })(req, res, next);
};
// controllers/authController.ts
export const forgotPassword = async (req, res) => {
    const user = await User.getOne(req.user.userId);
    const email = user.email;
    if (!user) {
        res.status(404).json({ message: 'Email not found' });
        return;
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_RESET_SECRET, { expiresIn: '15m' });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    await sendResetEmail(email, resetLink);
    res.status(200).json({ message: 'Reset email sent' });
};
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        console.log(decoded);
        const user = await User.getOne(decoded.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await User.updatePassword(decoded.id, hashedPassword);
        res.status(200).json({ message: 'Password updated' });
    }
    catch (err) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }
};
