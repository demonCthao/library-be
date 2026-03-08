import { NextFunction, Request, Response } from 'express';
import { PublisherService } from '../services/publisher.service';
import { BaseController } from './base.controller';

export class PublisherController extends BaseController<PublisherService> {
    constructor() {
        super(new PublisherService());
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const publisher = await this.service.store(req.body);

            return this.created(res, publisher);
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const publishers = await this.service.findAll(req.query);

            return this.ok(res, publishers);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const publisher = await this.service.update(
                Number(req.params.id),
                req.body
            );

            return this.ok(res, publisher);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const publisher = await this.service.destroy(
                Number(req.params.id),
            );

            return this.ok(res, publisher);
        } catch (err) {
            next(err);
        }
    }

    async getAllPublisher(_req: Request, res: Response, next: NextFunction) {
        try {
            const publisher = await this.service.getAllPublisher();

            return this.ok(res, publisher);
        } catch (err) {
            next(err);
        }
    }
}
