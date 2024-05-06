import express from "express";
import catRouter from "./api/routes/cat-router.js";
import userRouter from "./api/routes/user-router.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/cats", catRouter);
app.use("/api/v1/users", userRouter);

export default app;
