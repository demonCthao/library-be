import { NextFunction, Request, Response } from "express";
import CategoryBookService from "../services/category-book.service";
import { BaseController } from "./base.controller";

export class CategoryBookController extends BaseController<CategoryBookService> {
    constructor() {
        super(new CategoryBookService());
    }

    async store(req: Request, res: Response, next: NextFunction) {
        throw new Error();
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const books = await this.service.getAllBooksAndCategorie();

            return this.ok(res, books);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        throw new Error();
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
       throw new Error();
    }

    async exportExcel(_req: Request, res: Response, next: NextFunction) {
        throw new Error();
    }

    async getBookByKeyword(req: Request, res: Response, next: NextFunction) {
        throw new Error();
    }
}