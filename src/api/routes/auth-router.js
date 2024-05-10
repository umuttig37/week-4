import express from "express";
import { postLogin, getMe, logout } from "../controllers/auth-controller.js";
import { authenticateToken } from "../../middlewares.js";
import { postUser } from "../controllers/user-controller.js";
const authRouter = express.Router();

authRouter.route("/login").post(postLogin);
authRouter.route("/me").get(authenticateToken, getMe);
authRouter.route("/logout").get(logout);
authRouter.route("/register").post(postUser);
export { authRouter };
