import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { sendSuccess } from "../common/response.helper";

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const data = await UserService.getUsers(page, limit);
    
    return sendSuccess(res, data.users, data.total)
};

export { getUsers };
