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
 * /api/v1/category-books/:id:
 *   get:
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
 *         description: Book
 */
router.get('/:id', controller.getBookDetailById.bind(controller));

/**
 * @swagger
 * /api/v1/category-books/books/:id:
 *   get:
 *     summary: Get books from category ID
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
 *         description: Book
 */
router.get('/books/:id', controller.getBooksByCategoryId.bind(controller));

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