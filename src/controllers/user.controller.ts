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
            const user = await this.service.update(
                Number(req.params.id),
                req.body
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
}
