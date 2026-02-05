import { Request, Response, NextFunction } from 'express';

export abstract class BaseController<S> {
    protected service: S;

    constructor(service: S) {
        this.service = service;
    }

    abstract store(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void>;

    abstract findAll(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void>;

    abstract update(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void>;

    abstract destroy(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void>;
}
