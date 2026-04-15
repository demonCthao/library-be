// routes/bank.routes.ts
import { Router, Request, Response } from "express";
import { BankController } from "../controllers/bank.controller";

const router = Router();
const controller = new BankController();

/**
 * @swagger
 * tags:
 *   name: Banks
 *   description: Bank management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BankAccount:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         bank_code:
 *           type: string
 *         bank_name:
 *           type: string
 *         account_number:
 *           type: string
 *         owner_name:
 *           type: string
 *         is_default:
 *           type: integer
 *           enum: [1, 2]
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/banks:
 *   get:
 *     summary: Get all bank accounts
 *     tags: [Banks]
 *     responses:
 *       200:
 *         description: List of bank accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BankAccount'
 */
router.get("/", controller.getAllBankAccounts.bind(controller));

/**
 * @swagger
 * /api/v1/banks:
 *   post:
 *     summary: Create new bank account
 *     tags: [Banks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BankAccount'
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", controller.store.bind(controller));

/**
 * @swagger
 * /api/v1/banks/{id}:
 *   put:
 *     summary: Update bank account
 *     tags: [Banks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Bank account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bank_code:
 *                 type: string
 *               bank_name:
 *                 type: string
 *               account_number:
 *                 type: string
 *               owner_name:
 *                 type: string
 *               is_default:
 *                 type: integer
 *                 enum: [1, 2]
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 */
router.put("/:id", controller.update.bind(controller));

/**
 * @swagger
 * /api/v1/banks/{id}:
 *   delete:
 *     summary: Delete bank account
 *     tags: [Banks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Bank account ID
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
router.delete("/:id", controller.destroy.bind(controller));

export default router;