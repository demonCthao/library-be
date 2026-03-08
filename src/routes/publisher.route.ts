import { Router } from 'express';
import { PublisherController } from '../controllers/publisher.controller';

const router = Router();
const controller = new PublisherController();

/**
 * @swagger
 * /api/v1/publishers:
 *   get:
 *     summary: Get list of publishers
 *     tags: [Publishers]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: 
 *         description: Publisher Name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           example: 
 *         description: Email
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
 *         description: List of publishers
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * /api/v1/publishers:
 *   post:
 *     summary: Create new publisher
 *     tags: [Publishers]
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
 *                 example: publisher 1
 *               parent_id:
 *                 type: string
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: Publisher created
 */
router.post('/', controller.store.bind(controller));

/**
 * @swagger
 * /api/v1/publishers/{id}:
 *   put:
 *     summary: Update publisher
 *     tags: [Publishers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *         description: Publisher ID
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
 *         description: Publisher updated
 */
router.put('/:id', controller.update.bind(controller));

/**
 * @swagger
 * /api/v1/publishers/{id}:
 *   delete:
 *     summary: Delete publisher
 *     tags: [Publishers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Publisher ID
 *     responses:
 *       200:
 *         description: Publisher deleted
 */
router.delete('/:id', controller.destroy.bind(controller));

/**
 * @swagger
 * /api/v1/publishers/all:
 *   get:
 *     summary: Get all publishers
 *     tags: [Publishers]
 *     responses:
 *       200:
 *         description: All Publisher
 */
router.get("/all", controller.getAllPublisher.bind(controller));

export default router;
