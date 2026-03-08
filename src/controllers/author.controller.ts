import { NextFunction, Request, Response } from 'express';
import AuthorService from '../services/author.service';
import { BaseController } from "./base.controller";

export class AuthorController extends BaseController<AuthorService> {
    constructor() {
        super(new AuthorService());
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const author = await this.service.store(req.body);

            return this.created(res, author);
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const authors = await this.service.findAll(req.query);

            return this.ok(res, authors);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const author = await this.service.update(
                Number(req.params.id),
                req.body
            );

            return this.ok(res, author);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const author = await this.service.destroy(
                Number(req.params.id),
            );

            return this.ok(res, author);
        } catch (err) {
            next(err);
        }
    }

    async exportExcel(_req: Request, res: Response, next: NextFunction) {
        try {
            const author = await this.service.exportAuthors(res);

            return this.ok(res, author);
        } catch (err) {
            next(err);
        }
    }
}