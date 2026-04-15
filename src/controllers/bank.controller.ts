import { NextFunction, Request, Response } from "express";
import { BaseController } from "./base.controller";
import BankService from "../services/bank.service";

export class BankController extends BaseController<BankService> {
    constructor() {
        super(new BankService());
    }

    async store(req: Request, res: Response, next: NextFunction) {
        try {
            const bank = await this.service.store(req.body);

            return this.created(res, bank);
        } catch (err) {
            next(err);
        }
    }

    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const banks = await this.service.findAll();

            return this.ok(res, banks);
        } catch (err) {
            next(err);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const bank = await this.service.update(
                Number(req.params.id),
                req.body
            );

            return this.ok(res, bank);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        try {
            const bank = await this.service.destroy(
                Number(req.params.id),
            );

            return this.ok(res, bank);
        } catch (err) {
            next(err);
        }
    }

    async getAllBankAccounts(_req: Request, res: Response, next: NextFunction) {
        try {
            const banks = await this.service.getAllBankAccounts();

            return this.ok(res, banks);
        } catch (err) {
            next(err);
        }
    }
}