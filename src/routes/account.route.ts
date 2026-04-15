import { Router } from "express";
import { AccountController } from "../controllers/account.controller";

const router = Router();
const controller = new AccountController();

/**
 * @swagger
 * /api/v1/accounts:
 *   get:
 *     summary: Get list of accounts
 *     tags: [Accounts]
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *           example: 
 *         description: User Name
 *       - in: query
 *         name: pageIndex
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Items per page
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           example: username
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", controller.findAll.bind(controller));


/**
 * @swagger
 * /api/v1/accounts:
 *   post:
 *     summary: Create new account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - card_id
 *               - user_name
 *               - user_pass
 *               - lang
 *             properties:
 *               card_id:
 *                 type: string
 *                 example: "CARD001"
 *               user_name:
 *                 type: string
 *                 example: "John"
 *               user_pass:
 *                 type: string
 *                 example: "Doe"
 *               lang:
 *                 type: string
 *                 example: "vn"
 *     responses:
 *       201:
 *         description: Account created
 */
router.post("/", controller.store.bind(controller));

/**
 * @swagger
 * /api/v1/accounts:
 *   put:
 *     summary: Update Account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "John"
 *               password:
 *                 type: string
 *                 example: "Doe"
 *     responses:
 *       201:
 *         description: Account updated
 */
router.put("/", controller.update.bind(controller));

/**
 * @swagger
 * /api/v1/accounts/change-pass:
 *   post:
 *     summary: Update Account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - currentPass
 *               - newPassword
 *             properties:
 *               userName:
 *                 type: string
 *                 example: 
 *               currentPassword:
 *                 type: string
 *                 example: 
 *               newPassword:
 *                 type: string
 *                 example: 
 *     responses:
 *       201:
 *         description: Account updated
 */
router.post("/change-pass", controller.changePassword.bind(controller));


export default router;