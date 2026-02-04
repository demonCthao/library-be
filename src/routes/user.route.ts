import { Router } from "express";
import { getUsers } from "../controllers/user.controller";
import { paginationMiddleware } from "../common/pagination.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", paginationMiddleware, getUsers);

export default router;