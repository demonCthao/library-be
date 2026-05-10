import { NextFunction, Request, Response } from 'express';
import AuthorService from '../services/author.service';
import { BaseController } from "./base.controller";
import BorrowRecordService from '../services/borrow-record.service';

export class BorrowRecordController extends BaseController<BorrowRecordService> {
    constructor() {
        super(new BorrowRecordService());
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const borrow = await this.service.store(req.body);

            return this.created(res, borrow);
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const borrowRecords = await this.service.findAll(req.query);

            return this.ok(res, borrowRecords);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const borrow = await this.service.update(
                Number(req.params.id),
                req.body
            );

            return this.ok(res, borrow);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const borrow = await this.service.destroy(
                Number(req.params.id),
            );

            return this.ok(res, borrow);
        } catch (err) {
            next(err);
        }
    }

    async getBorrowDetailById(req: Request, res: Response, next: NextFunction) {
        try {
            const author = await this.service.getBorrowDetailById(
                Number(req.params.id),
            );

            return this.ok(res, author);
        } catch (err) {
            next(err);
        }
    }

     async returnBook(req: Request, res: Response, next: NextFunction) {
        try {
            const borrow = await this.service.returnBook(
                Number(req.params.id),
            );

            return this.ok(res, borrow);
        } catch (err) {
            next(err);
        }
     }
}