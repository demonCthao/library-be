import { Request, Response, NextFunction } from 'express';
import BookService from "../services/book.service";
import { BaseController } from "./base.controller";

export class BookController extends BaseController<BookService> {
    constructor() {
        super(new BookService());
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await this.service.store(req.body);

            return this.created(res, book);
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const books = await this.service.findAll(req.query);

            return this.ok(res, books);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            const parsedData = req.body.data
                ? JSON.parse(req.body.data)
                : {};
            const book = await this.service.update(
                Number(req.params.id),
                parsedData,
                file
            );

            return this.ok(res, book);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await this.service.destroy(
                Number(req.params.id),
            );

            return this.ok(res, book);
        } catch (err) {
            next(err);
        }
    }

    async exportExcel(_req: Request, res: Response, next: NextFunction) {
        try {
            const book = await this.service.exportBooks(res);

            return this.ok(res, book);
        } catch (err) {
            next(err);
        }
    }

    async getBookByKeyword(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await this.service.getBookByKeyword(req.query.keyword as string);

            return this.ok(res, book);
        } catch (err) {
            next(err);
        }
    }
}