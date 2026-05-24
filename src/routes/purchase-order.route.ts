import { Router } from 'express';
import { PurchaseOrderController } from '../controllers/purchase-order.controller';

const router = Router();
const controller = new PurchaseOrderController();

/**
 * @swagger
 * /api/v1/purchase-orders:
 *   get:
 *     summary: Get list of [Purchase Orders]
 *     tags: [Purchase Orders]
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
 *         description: List of [Purchase Orders]
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * /api/v1/purchase-orders:
 *   post:
 *     summary: Create new purchase order
 *     tags: [Purchase Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - books
 *             properties:
 *               user_id:
 *                 type: number
 *                 example: 1
 *
 *               books:
 *                 type: array
 *                 description: Danh sách sách mua
 *                 items:
 *                   type: object
 *                   required:
 *                     - book_id
 *                     - qty
 *                     - price
 *                   properties:
 *                     book_id:
 *                       type: number
 *                       example: 1
 *
 *                     qty:
 *                       type: number
 *                       minimum: 1
 *                       example: 2
 *
 *                     price:
 *                       type: number
 *                       example: 120000
 *
 *                 example:
 *                   - book_id: 1
 *                     qty: 2
 *                     price: 120000
 *
 *                   - book_id: 2
 *                     qty: 1
 *                     price: 90000
 *
 *     responses:
 *       201:
 *         description: Purchase order created successfully
 */
router.post('/', controller.store.bind(controller));

/**
 * @swagger
 * /api/v1/purchase-orders/{id}:
 *   put:
 *     summary: Update Purchase Order
 *     tags: [Purchase Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reader_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               guest_name:
 *                 type: string
 *                 nullable: true
 *                 example: Nguyen Van A
 *               guest_phone:
 *                 type: string
 *                 nullable: true
 *                 example: "0987654321"
 *               total_price:
 *                 type: number
 *                 example: 250000
 *               payment_status:
 *                 type: string
 *                 example: PAID
 *     responses:
 *       200:
 *         description: Purchase order updated successfully
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', controller.update.bind(controller));

/**
 * @swagger
 * /api/v1/purchase-orders/update-book/{id}:
 *   post:
 *     summary: Create Purchase Order Items
 *     tags: [Purchase Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     purchase_order_id:
 *                       type: integer
 *                       example: 1
 *                     book_id:
 *                       type: integer
 *                       example: 2
 *                     quantity:
 *                       type: integer
 *                       example: 5
 *                     unit_price:
 *                       type: number
 *                       example: 50000
 *     responses:
 *       201:
 *         description: Purchase order items created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/update-book/:id', controller.updatePurchaseOrderBook.bind(controller));

/**
 * @swagger
 * /api/v1/purchase-orders/{id}:
 *   delete:
 *     summary: Delete reader
 *     tags: [Purchase Orders]
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
 * /api/v1/purchase-orders/{id}:
 *   get:
 *     summary: Get Purchase Order Detail By Id
 *     tags: [Purchase Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Purchase Order ID
 *     responses:
 *       200:
 *         description: Purchase Order detail
 */
router.get('/:id', controller.getPurchaseOrderDetailById.bind(controller));

export default router;
