import { Router } from 'express';
import { ReaderController } from '../controllers/reader.controller';

const router = Router();
const controller = new ReaderController();

/**
 * @swagger
 * /api/v1/readers:
 *   get:
 *     summary: Get list of readers
 *     tags: [Readers]
 *     parameters:
 *       - in: query
 *         name: reader_code
 *         schema:
 *           type: string
 *           example: 
 *         description: Reader Code
 *       - in: query
 *         name: full_name
 *         schema:
 *           type: string
 *           example: 
 *         description: Full Name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           example: 
 *         description: Email
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
 *         description: List of readers
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * /api/v1/readers:
 *   post:
 *     summary: Create new reader
 *     tags: [Readers]
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
 *                 example: reader 1
 *               parent_id:
 *                 type: string
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: Reader created
 */
router.post('/', controller.store.bind(controller));

/**
 * @swagger
 * /api/v1/readers/{id}:
 *   put:
 *     summary: Update reader
 *     tags: [Readers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 1
 *         description: Reader ID
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
 *         description: Reader updated
 */
router.put('/:id', controller.update.bind(controller));

/**
 * @swagger
 * /api/v1/readers/{id}:
 *   delete:
 *     summary: Delete reader
 *     tags: [Readers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Reader ID
 *     responses:
 *       200:
 *         description: Reader deleted
 */
router.delete('/:id', controller.destroy.bind(controller));

/**
 * @swagger
 * /api/v1/readers/keyword:
 *   get:
 *     summary: Get list of readers by keyword
 *     tags: [Readers]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: hello
 *     responses:
 *       200:
 *         description: List of readers by keyword
 */
router.get("/keyword", controller.getReaderByKeyword.bind(controller));

export default router;
