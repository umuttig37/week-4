import express from "express";
import { postLogin, getMe, logout } from "../controllers/auth-controller.js";
import { authenticateToken } from "../../middlewares.js";
import { postUser } from "../controllers/user-controller.js";
import { validationErrors } from "../../middlewares.js";

import { body } from "express-validator";
const authRouter = express.Router();

authRouter.route("/login").post(postLogin);
authRouter.route("/me").get(authenticateToken, getMe);
authRouter.route("/logout").get(logout);
authRouter
  .route("/register")
  .post(
    body("username").trim().isLength({ min: 4, max: 15 }),
    body("name").trim().isLength({ min: 4, max: 15 }),
    body("email").trim().isEmail(),
    body("username").trim().isLength({ min: 3, max: 20 }),
    body("password").trim().isLength({ min: 5 }),
    validationErrors,
    postUser,
  );
export { authRouter };
