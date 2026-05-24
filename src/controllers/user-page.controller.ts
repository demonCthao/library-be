import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import { BaseController } from './base.controller';
import UserPageService from '../services/user-page.service';

export class UserPageController extends BaseController<UserPageService> {
    constructor() {
        super(new UserPageService());
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.service.register(req.body);

            return this.created(res, user);
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.service.findAll(req.query);

            return this.ok(res, users);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const file = req.file;
            console.log("🚀 ~ UserController ~ update ~ req.body:", req.body)
            const parsedData = req.body.data
                ? JSON.parse(req.body.data)
                : {};

            const user = await this.service.update(
                Number(req.params.id),
                parsedData,
                file
            );

            return this.ok(res, user);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.service.destroy(
                Number(req.params.id),
            );

            return this.ok(res, user);
        } catch (err) {
            next(err);
        }
    }

    async getOrderByID(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.service.getOrderByUserID(
                Number(req.params.id)
            );

            return this.ok(res, user);
        } catch (err) {
            next(err);
        }
    }

    async getUserByKeyword(req: Request, res: Response, next: NextFunction) {
        try {
            const reader = await this.service.getUserByKeyword(req.query.keyword as string);

            return this.ok(res, reader);
        } catch (err) {
            next(err);
        }
    }

    async getCartDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id, books } = req.query;
            const userId = user_id ? Number(user_id) : null;

            let parsedBooks = [];
            if (typeof books === 'string') {
                parsedBooks = JSON.parse(books);
            } else if (Array.isArray(books)) {
                parsedBooks = books;
            }

            const reader = await this.service.getCartDetails(userId, parsedBooks);

            return this.ok(res, reader);
        } catch (err) {
            next(err);
        }
    }
}