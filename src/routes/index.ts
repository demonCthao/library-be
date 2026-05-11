import { Router } from "express";
import userRouter from "./user.route";
import authRouter from "./auth.route";
import accountRouter from "./account.route";
import bookRouter from "./book.route";
import readersRouter from "./reader.route";
import authorsRouter from "./author.route";
import categoryRouter from "./category.route";
import borrowRecordRouter from "./borrow-record.route";
import publisherRouter from "./publisher.route";
import bankRouter from "./bank.route";
import purchaseOrderRouter from "./purchase-order.route";
import CategoryBookRouter from "./category-book.route";
import fineRouter from "./fine.route";
import { authMiddleware } from "../middlleware/auth.middleware";
import { loginRateLimit } from "../middlleware/rate-limit.middleware";

const router = Router();

router.use("/users", authMiddleware, userRouter);
router.use("/auth", loginRateLimit, authRouter);
router.use("/accounts", authMiddleware, accountRouter);
router.use("/books", authMiddleware, bookRouter);
router.use("/categories", authMiddleware, categoryRouter);
router.use("/readers", authMiddleware, readersRouter);
router.use("/authors", authMiddleware, authorsRouter);
router.use("/publishers", authMiddleware, publisherRouter);
router.use("/fines", authMiddleware, fineRouter);
router.use("/borrow-record", authMiddleware, borrowRecordRouter);
router.use("/banks", authMiddleware, bankRouter);
router.use("/purchase-orders", authMiddleware, purchaseOrderRouter);
router.use("/category-books", CategoryBookRouter);


export default router;
