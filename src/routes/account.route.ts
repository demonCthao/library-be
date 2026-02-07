import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';

const router = Router();
const controller = new AccountController();

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
router.post('/', controller.store.bind(controller));


export default router;