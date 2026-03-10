import { Router } from 'express';
import { BorrowRecordController } from '../controllers/borrow-record.controller';

const router = Router();
const controller = new BorrowRecordController();

/**
 * @swagger
 * /api/v1/borrow-record:
 *   get:
 *     summary: Get list of borrow records
 *     tags: [Borrow Records]
 *     parameters:
 *       - in: query
 *         name: readerName
 *         schema:
 *           type: string
 *           example: 
 *         description: Reader Name
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *           example: 
 *         description: Phone
 *       - in: query
 *         name: borrowDate
 *         schema:
 *           type: string
 *           example: 
 *         description: Borrow Date
 *       - in: query
 *         name: dueDate
 *         schema:
 *           type: string
 *           example: 
 *         description: Due Date
 *       - in: query
 *         name: returnDate
 *         schema:
 *           type: string
 *           example: 
 *         description: Return Date
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           example: 
 *         description: Status
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
 *           example: title
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
 *         description: List of borrow records
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * /api/v1/borrow-record:
 *   post:
 *     summary: Create new borrow-record
 *     tags: [Borrow Records]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - due_date
 *               - reader_id
 *               - books
 *             properties:
 *               due_date:
 *                 type: string
 *                 example: "22/06/2026"
 *               reader_id:
 *                 type: number
 *                 example: 1
 *               books:
 *                 type: array
 *                 example: [1,2,3]
 *     responses:
 *       201:
 *         description: Borrow Record created
 */
router.post('/', controller.store.bind(controller));

/**
 * @swagger
 * /api/v1/borrow-record/{id}:
 *   put:
 *     summary: Update Borrow Record
 *     tags: [Borrow Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
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
 *         description: Book updated successfully
 */
router.put('/:id', controller.update.bind(controller));

/**
 * @swagger
 * /api/v1/borrow-record/{id}:
 *   delete:
 *     summary: Delete Borrow Record
 *     tags: [Borrow Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Borrow Record ID
 *     responses:
 *       200:
 *         description: Borrow Record deleted
 */
router.delete('/:id', controller.destroy.bind(controller));

/**
 * @swagger
 * /api/v1/borrow-record/{id}:
 *   get:
 *     summary: Get Borrow Detail By Id
 *     tags: [Borrow Records]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Borrow Record ID
 *     responses:
 *       200:
 *         description: Borrow Record deleted
 */
router.get('/:id', controller.getBorrowDetailById.bind(controller));

export default router;