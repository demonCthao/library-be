import { Router } from "express";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import accountRouter from "./account.route";
import { authMiddleware } from "../middlleware/auth.middleware";
import { loginRateLimit } from "../middlleware/rate-limit.middleware";

const router = Router();

router.use("/users", authMiddleware, userRouter);
router.use("/auth", loginRateLimit, authRouter);
router.use("/accounts",authMiddleware, accountRouter);

export default router;
