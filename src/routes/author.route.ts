import { Router } from 'express';
import { AuthorController } from '../controllers/author.controller';
import { createUploader } from '../middlleware/upload.middleware';

const router = Router();
const controller = new AuthorController();

/**
 * @swagger
 * /api/v1/authors:
 *   get:
 *     summary: Get list of authors
 *     tags: [Authors]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           example: 
 *         description: Author Name
 *       - in: query
 *         name: bio
 *         schema:
 *           type: string
 *           example: 
 *         description: Biography
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
 *         description: List of authors
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * /api/v1/authors:
 *   post:
 *     summary: Create new author
 *     tags: [Authors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               card_id:
 *                 name: string
 *                 example: "CARD001"
 *               bio:
 *                 type: string
 *                 example: "John"
 *     responses:
 *       201:
 *         description: Author created
 */
router.post('/', controller.store.bind(controller));

/**
 * @swagger
 * /api/v1/authors/{id}:
 *   put:
 *     summary: Update author
 *     tags: [Authors]
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
 *                 description: JSON string of author data
 *                 example: 
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Author updated successfully
 */
router.put('/:id', controller.update.bind(controller));

/**
 * @swagger
 * /api/v1/authors/{id}:
 *   delete:
 *     summary: Delete author
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author deleted
 */
router.delete('/:id', controller.destroy.bind(controller));

/**
 * @swagger
 * /api/v1/authors/excel:
 *   post:
 *     summary: Export author
 *     tags: [Authors]
 *     responses:
 *       200:
 *         description: Export Excel Author
 */
router.post("/excel", controller.exportExcel.bind(controller));

export default router;