import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwtUtils.js";


export const handleGoogleRoute = passport.authenticate('google', { scope: ['profile', 'email'] })

export const handleGoogleAuthRoute = async  (req: Request, res: Response, next: NextFunction) => {
    // Use passport to handle the callback. We disable sessions.
    passport.authenticate('google', { session: false }, (err, user, info) => {
        console.log(3232)
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
        }
    )(req, res, next);
}
