import express from "express";
const UserRouter = express.Router();
import {getAllUsers, getCurrentUser, authenticateUser, getUser, createUser, updateUser, deleteUser, changePassword} from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

UserRouter.get("/verify-token", authenticate, getCurrentUser);
UserRouter.get("/", getAllUsers);
UserRouter.get("/:id", getUser);
UserRouter.post("/", createUser);
UserRouter.put("/:id", updateUser);
UserRouter.delete("/:id", deleteUser);
UserRouter.post("/login", authenticateUser)
UserRouter.post("/change-password", authenticate , changePassword)

export default UserRouter;