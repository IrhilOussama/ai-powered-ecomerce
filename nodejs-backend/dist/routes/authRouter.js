import express from 'express';
import { handleGoogleAuthRoute, handleGoogleRoute } from '../controllers/authController.js';
const AuthRouter = express.Router();
AuthRouter.get("/google", handleGoogleRoute);
AuthRouter.get("/google/callback", handleGoogleAuthRoute);
export default AuthRouter;
