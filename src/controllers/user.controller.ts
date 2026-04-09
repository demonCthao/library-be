import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import { BaseController } from './base.controller';

export class UserController extends BaseController<UserService> {
    constructor() {
        super(new UserService());
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.service.store(req.body);

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

    async getProfileByID(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.service.getProfileByID(
                Number(req.params.id),
                req.user
            );

            return this.ok(res, user);
        } catch (err) {
            next(err);
        }
    }


    async exportExcel(_req: Request, res: Response, next: NextFunction) {
        try {
            const file = await this.service.exportUsers(res);

            return this.ok(res, file);
        } catch (err) {
            next(err);
        }
    }
}
