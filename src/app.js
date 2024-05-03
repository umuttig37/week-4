import express from "express";
import catRouter from "./api/routes/cat-router.js";
import userRouter from "./api/routes/user-router.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/cat", catRouter);
app.use("/api/v1/user", userRouter);

export default app;