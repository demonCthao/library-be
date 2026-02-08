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
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 */
router.post('/login', controller.login.bind(controller));

export default router;