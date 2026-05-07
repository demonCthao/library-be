import { Router } from 'express';
import { CategoryBookController } from '../controllers/category-book.controller';
import { createUploader } from '../middlleware/upload.middleware';

const router = Router();
const bookUpload = createUploader("books");
const controller = new CategoryBookController();

/**
 * @swagger
 * /api/v1/category-books:
 *   get:
 *     summary: Get list of books
 *     tags: [Category-Books]
 *     responses:
 *       200:
 *         description: List of books
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * /api/v1/category-books:
 *   post:
 *     summary: Create new book
 *     tags: [Category-Books]
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
 *         description: Book created
 */
router.post('/', controller.store.bind(controller));

/**
 * @swagger
 * /api/v1/category-books/{id}:
 *   put:
 *     summary: Update book
 *     tags: [Category-Books]
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
router.put('/:id', bookUpload.single("image"), controller.update.bind(controller));

/**
 * @swagger
 * /api/v1/category-books/{id}:
 *   delete:
 *     summary: Delete book
 *     tags: [Category-Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted
 */
router.delete('/:id', controller.destroy.bind(controller));

/**
 * @swagger
 * /api/v1/category-books/excel:
 *   post:
 *     summary: Export book
 *     tags: [Category-Books]
 *     responses:
 *       200:
 *         description: Export Excel Book
 */
router.post("/excel", controller.exportExcel.bind(controller));

/**
 * @swagger
 * /api/v1/category-books/keyword:
 *   get:
 *     summary: Get list of books by keyword
 *     tags: [Category-Books]
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *           example: hello
 *     responses:
 *       200:
 *         description: List of books by keyword
 */
router.get("/keyword", controller.getBookByKeyword.bind(controller));

export default router;