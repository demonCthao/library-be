import { Router } from 'express';
import FineController from '../controllers/fine.controller';

const router = Router();
const controller = new FineController();

/**
 * @swagger
 * /api/v1/fines:
 *   get:
 *     summary: Get list of fines
 *     tags: [Fines]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: 
 *         description: Name
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *           example: 
 *         description: Phone
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *           example: 
 *         description: Phone
 *       - in: query
 *         name: dueDate
 *         schema:
 *           type: string
 *           example: 
 *         description: Due date
 *       - in: query
 *         name: returnDate
 *         schema:
 *           type: string
 *           example: 
 *         description: Return date
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
 *           example: name
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
 *         description: List of fines
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * /api/v1/fines:
 *   post:
 *     summary: Create new fine
 *     tags: [Fines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - borrow_id
 *               - reason
 *             properties:
 *               borrow_id:
 *                 type: string
 *                 example: 0
 *               reason:
 *                 type: string
 *                 nullable: true
 *                 example: Hư hỏng
 *     responses:
 *       201:
 *         description: Fine created
 */
router.post('/', controller.store.bind(controller));

/**
 * @swagger
 * /api/v1/fines/{id}:
 *   put:
 *     summary: Update fine
 *     tags: [Fines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         schema:
 *           type: string
 *           example: 0
 *         description: Fine ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reson:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Fine updated
 */
router.put('/:id', controller.update.bind(controller));

/**
 * @swagger
 * /api/v1/fines/{id}:
 *   delete:
 *     summary: Delete fine
 *     tags: [Fines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Fine ID
 *     responses:
 *       200:
 *         description: Fine deleted
 */
router.delete('/:id', controller.destroy.bind(controller));

export default router;
