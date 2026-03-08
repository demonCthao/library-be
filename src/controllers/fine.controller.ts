import { NextFunction, Request, Response } from "express";
import { FineService } from "../services/fine.service";
import { BaseController } from "./base.controller";

class FineController extends BaseController<FineService> {
    constructor() {
        super(new FineService());
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const fine = await this.service.store(req.body);

            return this.created(res, fine);
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const fines = await this.service.findAll(req.query);

            return this.ok(res, fines);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const fine = await this.service.update(
                Number(req.params.id),
                req.body,
            );

            return this.ok(res, fine);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const fine = await this.service.destroy(
                Number(req.params.id),
            );

            return this.ok(res, fine);
        } catch (err) {
            next(err);
        }
    }
}

export default FineController;