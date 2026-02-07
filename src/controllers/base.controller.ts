import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../common/response.helper';

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

    protected ok<T>(res: Response, data: T, message?: string) {
        const response: ApiResponse<T> = {
            success: true,
            data,
            message,
        };
        return res.status(200).json(response);
    }

    protected created<T>(res: Response, data: T, message?: string) {
        return res.status(201).json({
            success: true,
            data,
            message,
        });
    }

    protected noContent(res: Response) {
        return res.status(204).send();
    }
}
