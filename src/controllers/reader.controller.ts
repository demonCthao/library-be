import { NextFunction, Request, Response } from 'express';
import { ReaderService } from '../services/reader.service';
import { BaseController } from './base.controller';

export class ReaderController extends BaseController<ReaderService> {
    constructor() {
        super(new ReaderService());
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const reader = await this.service.store(req.body);

            return this.created(res, reader);
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const readers = await this.service.findAll(req.query);

            return this.ok(res, readers);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const reader = await this.service.update(
                Number(req.params.id),
                req.body
            );

            return this.ok(res, reader);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const reader = await this.service.destroy(
                Number(req.params.id),
            );

            return this.ok(res, reader);
        } catch (err) {
            next(err);
        }
    }

    async getReaderByKeyword(req: Request, res: Response, next: NextFunction) {
        try {
            const reader = await this.service.getReaderByKeyword(req.query.keyword as string);

            return this.ok(res, reader);
        } catch (err) {
            next(err);
        }
    }
}
