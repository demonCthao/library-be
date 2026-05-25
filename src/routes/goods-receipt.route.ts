import { Router, Request, Response, NextFunction } from 'express';
import { GoodsReceiptController } from '../controllers/goods-receipt.controller';
import { createUploader } from '../middlleware/upload.middleware';

const router = Router();
const receiptUpload = createUploader("goods-receipts");
const controller = new GoodsReceiptController();

/**
 * Middleware phụ trợ: Tự động giải mã chuỗi JSON từ trường 'data' của FormData 
 * và ghi đè ngược lại vào req.body để đồng bộ cấu trúc với hệ thống Validate Core.
 */
const parseJsonBodyData = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body && typeof req.body.data === 'string') {
      req.body = JSON.parse(req.body.data);
    }
    next();
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: "Định dạng JSON trong trường 'data' không hợp lệ."
    });
  }
};

/**
 * @swagger
 * /api/v1/goods-receipts:
 * get:
 * summary: Get list of goods receipts (Lấy danh sách phiếu nhập kho)
 * tags: [Goods Receipts]
 * parameters:
 * - in: query
 * name: code
 * schema:
 * type: string
 * description: Tìm theo mã phiếu nhập (Ví dụ: PN260526001)
 * - in: query
 * name: publisher_id
 * schema:
 * type: integer
 * description: Lọc theo ID của nhà xuất bản
 * - in: query
 * name: pageIndex
 * schema:
 * type: integer
 * example: 1
 * description: Số trang hiện tại
 * - in: query
 * name: pageSize
 * schema:
 * type: integer
 * example: 10
 * description: Số lượng bản ghi trên mỗi trang
 * responses:
 * 200:
 * description: List of goods receipts fetched successfully
 */
router.get('/', controller.findAll.bind(controller));

/**
 * @swagger
 * /api/v1/goods-receipts:
 * post:
 * summary: Create new goods receipt (Tạo phiếu nhập kho & tự động tăng kho sách)
 * tags: [Goods Receipts]
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * required:
 * - data
 * properties:
 * data:
 * type: string
 * description: Chuỗi JSON String chứa thông tin phiếu và chi tiết mảng sách lồng nhau
 * example: >
 * {"publisher_id":1,"created_by":2,"details":[{"book_id":10,"quantity":50,"import_price":45000}]}
 * responses:
 * 201:
 * description: Goods receipt created and stock updated successfully
 * 400:
 * description: Invalid input or JSON format error
 * 404:
 * description: One of the provided Book IDs does not exist
 */
router.post('/', receiptUpload.none(), parseJsonBodyData, controller.store.bind(controller));

/**
 * @swagger
 * /api/v1/goods-receipts/{id}:
 * put:
 * summary: Update goods receipt information (Cập nhật thông tin phiếu nhập kho)
 * tags: [Goods Receipts]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: Goods Receipt ID
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * required:
 * - data
 * properties:
 * data:
 * type: string
 * description: Chuỗi JSON String chứa thông tin cần cập nhật
 * example: >
 * {"publisher_id":1,"created_by":2}
 * responses:
 * 200:
 * description: Goods receipt updated successfully
 * 400:
 * description: Invalid input or JSON format error
 * 404:
 * description: Goods receipt not found
 */
router.put('/:id', receiptUpload.none(), parseJsonBodyData, controller.update.bind(controller));

/**
 * @swagger
 * /api/v1/goods-receipts/{id}:
 * delete:
 * summary: Delete a goods receipt (Xóa phiếu nhập kho)
 * tags: [Goods Receipts]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: Goods Receipt ID
 * responses:
 * 200:
 * description: Goods receipt deleted successfully
 * 404:
 * description: Goods receipt not found
 */
router.delete('/:id', controller.destroy.bind(controller));

export default router;