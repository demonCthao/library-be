import { Request, Response, NextFunction } from 'express';
import { AccountService } from "../services/account.service";
import { BaseController } from "./base.controller";

export class AccountController extends BaseController<AccountService> {
    constructor() {
        super(new AccountService());
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
                req.params.id as string,
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
                req.params.id as string,
            );

            return this.ok(res, user);
        } catch (err) {
            next(err);
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction) {
        console.log("🚀 ~ AccountController ~ changePassword ~ req:", req.params)
        try {
            const account = await this.service.changePassword(
                req.body.userName as string,
                req.body.currentPassword as string,
                req.body.newPassword as string,
            );

            return this.ok(res, account);
        } catch (err) {
            next(err);
        }
    }
}