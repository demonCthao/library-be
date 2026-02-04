import { Request, Response, NextFunction } from "express";

interface PaginationQuery {
  page: number;
  limit: number;
  offset: number;
}

function paginationMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;

    req.pagination = { page, limit, offset };

    next();
}

export { paginationMiddleware, PaginationQuery }