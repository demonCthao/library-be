import { Router } from 'express';
import CategoryController from '../controllers/category.controller';

const router = Router();
const controller = new CategoryController();

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Get list of categories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: 
 *         description: Name
 *       - in: query
 *         name: parent_id
 *         schema:
 *           type: number
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
 *         description: List of categories
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Create new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: category 1
 *               parent_id:
 *                 type: string
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/', controller.store.bind(controller));

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               parent_id:
 *                 type: number
 *                 example: "Doe"
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put('/:id', controller.update.bind(controller));

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete('/:id', controller.destroy.bind(controller));

/**
 * @swagger
 * /api/v1/categories/all:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: All Category
 */
router.get("/all", controller.getAllCategories.bind(controller));

/**
 * @swagger
 * /api/v1/categories/excel:
 *   post:
 *     summary: Export category
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Export Excel Book
 */
router.post("/excel", controller.exportExcel.bind(controller));

export default router;
