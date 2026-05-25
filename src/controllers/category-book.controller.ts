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

    async getBookDetailById(req: Request, res: Response, next: NextFunction) {
        try {
            const books = await this.service.getBookDetailById(req.params.id as string);

            return this.ok(res, books);
        } catch (err) {
            next(err);
        }
    }

    async getBooksByCategoryId(req: Request, res: Response, next: NextFunction) {
        try {
            const books = await this.service.getBooksByCategoryId(req.params.id as string);

            return this.ok(res, books);
        } catch (err) {
            next(err);
        }
    }

    async getBookChapterByIndex(req: Request, res: Response, next: NextFunction) {
        try {
            const bookId = parseInt(req.params.bookId as string, 10);
            const chapterIndex = parseInt(req.query.chapterIndex as string, 10) || 0;
            if (isNaN(bookId)) {
                return res.status(400).json({ message: "bookId không hợp lệ, phải là số nguyên." });
            }
            const bookChapter = await this.service.getBookChapterByIndex(bookId, chapterIndex);

            if (!bookChapter) {
                return res.status(404).json({ message: "Không tìm thấy cuốn sách yêu cầu." });
            }

            return this.ok(res, bookChapter);

        } catch (err) {
            next(err);
        }
    }
}