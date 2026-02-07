import { Request, Response, NextFunction } from 'express';
import { AuthService } from "../services/auth.service"

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_name, user_pass } = req.body;
            const result = await this.authService.login(user_name, user_pass, req);

            return res.json(result);
        } catch (error) {
            next(error);
        }
    }
}