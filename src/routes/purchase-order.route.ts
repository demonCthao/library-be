import { Router } from 'express';
import { PurchaseOrderController } from '../controllers/purchase-order.controller';

const router = Router();
const controller = new PurchaseOrderController();

/**
 * @swagger
 * /api/v1/purchase-orders:
 *   get:
 *     summary: Get list of Purchase Orders
 *     tags: [PurchaseOrders]
 *     parameters:
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *           example: 
 *         description: Phone
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
 *         description: List of Purchase Orders
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * /api/v1/purchase-orders:
 *   post:
 *     summary: Create new reader
 *     tags: [PurchaseOrders]
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
 * /api/v1/purchase-orders/{id}:
 *   put:
 *     summary: Update reader
 *     tags: [PurchaseOrders]
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
 * /api/v1/purchase-orders/{id}:
 *   delete:
 *     summary: Delete reader
 *     tags: [PurchaseOrders]
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

export default router;
