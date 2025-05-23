import express from "express";
const UserRouter = express.Router();
import { getAllUsers, getCurrentUser, authenticateUser, getUser, createUser, updateUser, deleteUser, changePassword, requestEmailChange, confirmEmailChange } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { forgotPassword, resetPassword } from "../controllers/authController.js";
UserRouter.get("/verify-token", authenticate, getCurrentUser);
UserRouter.get("/", getAllUsers);
UserRouter.get("/:id", getUser);
UserRouter.post("/", createUser);
UserRouter.put("/:id", authenticate, updateUser);
UserRouter.delete("/:id", deleteUser);
UserRouter.post("/login", authenticateUser);
UserRouter.post("/change-password", authenticate, changePassword);
UserRouter.post('/forgot-password', authenticate, forgotPassword);
UserRouter.post('/reset-password/:token', authenticate, resetPassword);
UserRouter.post("/change-email-request", authenticate, requestEmailChange);
UserRouter.post("/confirm-email-change", authenticate, confirmEmailChange);
export default UserRouter;
