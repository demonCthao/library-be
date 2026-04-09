import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { createUploader } from '../middlleware/upload.middleware';

const router = Router();
const userUpload = createUploader("users");
const controller = new UserController();

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get list of users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *           example: 
 *         description: Full Name
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *           example: 
 *         description: Phone
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
 *           example: fullName
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
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
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
router.post('/', controller.store.bind(controller));

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
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
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
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
 * /api/v1/users/profile/{id}:
 *   get:
 *     summary: Get profile user by ID
 *     tags: [Users]
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
 *         description: Get User By ID
 */
router.get("/profile/:id", controller.getProfileByID.bind(controller));

/**
 * @swagger
 * /api/v1/users/excel:
 *   post:
 *     summary: Export user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Export Excel User
 */
router.post("/excel", controller.exportExcel.bind(controller));

export default router;
