import { Request, Response, NextFunction } from "express";
import CategoryService from "../services/category.service";
import { BaseController } from "./base.controller";

class CategoryController extends BaseController<CategoryService> {
    constructor() {
        super(new CategoryService());
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await this.service.store(req.body);

            return this.created(res, category);
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await this.service.findAll(req.query);

            return this.ok(res, categories);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await this.service.update(
                Number(req.params.id),
                req.body,
            );

            return this.ok(res, category);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await this.service.destroy(
                Number(req.params.id),
            );

            return this.ok(res, category);
        } catch (err) {
            next(err);
        }
    }

    async getAllCategories(_req: Request, res: Response, next: NextFunction) {
        try {
            const category = await this.service.getAllCategories();

            return this.ok(res, category);
        } catch (err) {
            next(err);
        }
    }

    async exportExcel(_req: Request, res: Response, next: NextFunction) {
        try {
            const file = await this.service.exportCategories(res);

            return this.ok(res, file);
        } catch (err) {
            next(err);
        }
    }
}

export default CategoryController;