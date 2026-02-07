import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const controller = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User management
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Auth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - user_pass
 *             properties:
 *               user_name:
 *                 type: string
 *               user_pass:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 */
router.post('/login', controller.login.bind(controller));

export default router;