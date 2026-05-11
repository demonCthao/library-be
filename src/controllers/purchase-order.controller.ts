import { NextFunction, Request, Response } from 'express';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { BaseController } from './base.controller';

export class PurchaseOrderController extends BaseController<PurchaseOrderService> {
    constructor() {
        super(new PurchaseOrderService());
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const purchaseOrder = await this.service.store(req.body);

            return this.created(res, purchaseOrder);
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const purchaseOrders = await this.service.findAll(req.query);

            return this.ok(res, purchaseOrders);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const purchaseOrder = await this.service.update(
                Number(req.params.id),
                req.body
            );

            return this.ok(res, purchaseOrder);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const purchaseOrder = await this.service.destroy(
                Number(req.params.id),
            );

            return this.ok(res, purchaseOrder);
        } catch (err) {
            next(err);
        }
    }
}
