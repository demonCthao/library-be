import { Request, Response, NextFunction } from "express";
import GoodsReceiptService from "../services/goods-receipt.service";
import { BaseController } from "./base.controller";

export class GoodsReceiptController extends BaseController<GoodsReceiptService> {
    constructor() {
        super(new GoodsReceiptService());
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const parsedData = req.body.data
                ? JSON.parse(req.body.data)
                : req.body;

            const receiptInput = {
                publisher_id: parsedData.publisher_id,
                created_by: parsedData.created_by,
                details: parsedData.details
            };

            const goodsReceipt = await this.service.store(receiptInput);

            return this.created(res, goodsReceipt);
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const receipts = await this.service.findAll(req.query);

            return this.ok(res, receipts);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const parsedData = req.body.data
                ? JSON.parse(req.body.data)
                : req.body;

            const goodsReceipt = await this.service.update(
                Number(req.params.id),
                parsedData
            );

            return this.ok(res, goodsReceipt);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const goodsReceipt = await this.service.destroy(
                Number(req.params.id)
            );

            return this.ok(res, goodsReceipt);
        } catch (err) {
            next(err);
        }
    }

    async exportExcel(_req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.service.exportGoodsReceipts(res);

            return this.ok(res, result);
        } catch (err) {
            next(err);
        }
    }
}