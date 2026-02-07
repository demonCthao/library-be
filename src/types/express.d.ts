import { PaginationQuery } from "../common/pagination.middleware";

declare global {
  namespace Express {
    interface Request {
      pagination?: PaginationQuery;
      user?: string | JwtPayload;
    }
  }
}
