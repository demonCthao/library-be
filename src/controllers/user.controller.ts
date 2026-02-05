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
            return res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.service.findAll(req.query);
            return res.json(users);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.service.update(
                req.params.id as string,
                req.body
            );
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.service.destroy(
                req.params.id as string,
            );
            return res.json(user);
        } catch (err) {
            next(err);
        }
    }
}
