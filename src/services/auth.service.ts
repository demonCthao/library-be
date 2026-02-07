import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ForbiddenException, NotFoundException, UnauthorizedException } from "../exceptions";
import { prisma } from "../lib/prisma";
import { Request } from 'express';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '1h';

export class AuthService {
    async login(user_name: string, user_pass: string, req: Request) {
        const account = await prisma.accounts.findFirst({
            where: { user_name },
            include: { users: true },
        });

        if (!account) {
            throw new NotFoundException('Không tìm thấy tài khoản');
        }

        if (
            account.locked_until &&
            account.locked_until > new Date()
        ) {
            throw new ForbiddenException(
                "Tài khoản bị khóa tạm thời, vui lòng thử lại sau"
            );
        }

        const isMatch = await bcrypt.compare(user_pass, account.user_pass);

        if (!isMatch) {
            const failedAttempts = account.failed_attempts + 1;
            const updateFailedAttempts = {
                failed_attempts: failedAttempts,
                locked_until: account.locked_until,
                last_login_ip: req.ip
            };

            if (failedAttempts >= 5) {
                updateFailedAttempts.locked_until = new Date(
                    Date.now() + 15 * 60 * 1000
                );
            }

            await prisma.accounts.update({ where: { account_id: account.account_id }, data: updateFailedAttempts })

            throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
        }

        const payload = {
            userId: account.users.card_id,
            userName: account.user_name,
        };

        const accessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        await prisma.accounts.update({
            where: {
                account_id: account.account_id,
            },
            data: {
                failed_attempts: 0,
                locked_until: null
            }
        })

        return {
            accessToken,
            user: account.users,
            account: {
                lang: account.lang
            }
        };
    }
}