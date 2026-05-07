import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ForbiddenException, NotFoundException, UnauthorizedException } from "../exceptions";
import { prisma } from "../lib/prisma";
import { Request } from 'express';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '12h';

export class AuthService {
    async login(username: string, password: string, req: Request) {
        const account = await prisma.accounts.findFirst({
            where: { username: username },
            include: {
                users: {
                    select: {
                        full_name: true,
                        lang: true,
                        created_at: true,
                        phone: true,
                        role: true,
                        status: true,
                        email: true,
                        avatar_path: true
                    }
                }
            }
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

        const isMatch = await bcrypt.compare(password, account.password);

        if (!isMatch) {
            const failedAttempts = account.failed_attempts?? 0 + 1;
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

            await prisma.users.update({ where: { id: account.id }, data: updateFailedAttempts })

            throw new UnauthorizedException('Sai tài khoản hoặc mật khẩu');
        }

        const payload = {
            userId: account.id,
            userName: account.username,
            lang: account.users.lang,
            fullName: account.users.full_name,
            loginAt: new Date().getTime(),
            role: account.users.role,
            email: account.users.email,
            avatarPath: account.users.avatar_path
        };

        const accessToken = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });

        await prisma.accounts.update({
            where: {
                id: account.id,
            },
            data: {
                failed_attempts: 0,
                locked_until: null
            }
        })

        return {
            access_token: accessToken,
            user: account.users
        };
    }
}