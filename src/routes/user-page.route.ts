import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { createUploader } from '../middlleware/upload.middleware';
import { UserPageController } from '../controllers/user-page.controller';

const router = Router();
const userUpload = createUploader("users-pages");
const controller = new UserPageController();

/**
 * @swagger
 * /api/v1/users-pages/register:
 *   post:
 *     summary: Create new user
 *     tags: [Users-Pages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - card_id
 *               - first_name
 *               - last_name
 *               - email
 *             properties:
 *               card_id:
 *                 type: string
 *                 example: "CARD001"
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "john@example.com"
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/register', controller.store.bind(controller));

/**
 * @swagger
 * /api/v1/users-pages/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users-Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string of book data
 *                 example: 
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('/:id', userUpload.single("image"), controller.update.bind(controller));

/**
 * @swagger
 * /api/v1/users-pages/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users-Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/:id', controller.destroy.bind(controller));

/**
 * @swagger
 * /api/v1/users-pages/orders/{id}:
 *   get:
 *     summary: Get order user by ID
 *     tags: [Users-Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: User ID
 *     responses:
 *       200:
 *         description: Get Order By User ID
 */
router.get("/orders/:id", controller.getOrderByID.bind(controller));

/**
 * @swagger
 * /api/v1/users-pages/keyword:
 *   get:
 *     summary: Get list of users by keyword
 *     tags: [Users-Pages]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: hello
 *     responses:
 *       200:
 *         description: List of users by keyword
 */
router.get("/keyword", controller.getUserByKeyword.bind(controller));

/**
 * @swagger
 * /api/v1/users-pages/cart/details:
 * get:
 * summary: Get full book details for cart from query data
 * tags: [Users-Pages]
 * parameters:
 * - in: query
 * name: user_id
 * schema:
 * type: integer
 * example: 1
 * - in: query
 * name: books
 * description: JSON string of cart items or serialized array
 * schema:
 * type: string
 * example: '[{"book_id": 10, "quantity": 2}, {"book_id": 12, "quantity": 1}]'
 * responses:
 * 200:
 * description: List of detailed books in cart with totals
 */
router.get("/cart/details", controller.getCartDetails.bind(controller));

export default router;
