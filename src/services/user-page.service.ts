import ExcelJS from "exceljs";
import { Response } from "express";
import { AlreadyExistsException, ForbiddenException, NotFoundException } from "../exceptions";
import { Prisma, purchase_orders, users, users_role } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";
import path from "path";
import fs from "fs";
import dayjs from "dayjs";
import { UserDto } from "../dto/user.dto";
import * as bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

interface FindUserQuery extends FindAllQuery {
    fullName?: string;
    phone?: string
}

interface CreateUser {
    username: string
    password: string
    phone: string
    email: string
    full_name: string
}

interface FindCardByUser {

}

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "12h";

export class UserPageService extends BaseService<users> {

    async store(dto: CreateUser): Promise<users> {
        throw new Error();
    }

    async findAll({ pageIndex = 1, pageSize = 10, fullName = "", phone = "" }: FindUserQuery): Promise<PaginatedResult<users>> {
        const pageSearch = Math.max(1, Number(pageIndex)) || 1;
        const limitSearch = Number(pageSize) || 10;
        const where: Prisma.usersWhereInput = {
            full_name: {
                contains: fullName,
            },
            phone: {
                contains: phone
            }
        }

        const [list, total] = await Promise.all([
            prisma.users.findMany({
                skip: (pageSearch - 1) * limitSearch,
                take: limitSearch,
                orderBy: { full_name: "desc" },
                where,
                include: {
                    accounts: {
                        select: {
                            id: true,
                            username: true,
                            failed_attempts: true,
                            locked_until: true,
                            created_at: true,
                            updated_at: true,
                        }
                    }
                }
            }),
            prisma.users.count({ where })
        ])

        return { list, total };
    }

    async update(id: number, data: Partial<users>, file?: Express.Multer.File): Promise<users> {

        const existingUser = await prisma.users.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!existingUser) {
            throw new NotFoundException("User");
        }

        if (file) {
            // Xóa ảnh cũ
            if (existingUser.avatar_path) {
                const oldPath = path.join(
                    process.cwd(),
                    existingUser.avatar_path
                );

                if (fs.existsSync(oldPath)) {
                    await fs.promises.unlink(oldPath);
                }
            }

            data.avatar_path = `/uploads/users/${file.filename}`;
        }

        const res = await prisma.users.update({
            where: { id: Number(id) },
            data
        });

        if (!res) {
            throw new NotFoundException("User");
        }

        return res;
    }

    async destroy(id: number): Promise<users> {
        return await prisma.users.delete({
            where: { id: id }
        });
    }

    async getOrderByUserID(id: number): Promise<purchase_orders[]> {
        return await prisma.purchase_orders.findMany({
            where: {
                user_id: id 
            },
            include: {
                users: true,
                purchase_order_items: {
                    include: {
                        books: true,
                    }
                },
            },
            orderBy: {
                created_at: 'desc'
            }
        });
    }

    async exportUsers(res: Response) {
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=users.xlsx"
        );

        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            stream: res
        });

        const worksheet = workbook.addWorksheet("Users");

        worksheet.columns = [
            { header: "NO", key: "no", width: 10 },
            { header: "Name", key: "name", width: 30 },
            { header: "Phone", key: "phone", width: 40 },
            { header: "Email", key: "email", width: 45 },
            { header: "Update At", key: "updated_at", width: 45 },
            { header: "Status", key: "status", width: 15 },
        ];

        let lastId: number | null = null;
        let no: number = 0;

        while (true) {
            const users: users[] = await prisma.users.findMany({
                take: 1000,
                ...(lastId && { cursor: { id: lastId }, skip: 1 }),
                orderBy: { id: "asc" }
            });

            if (users.length === 0) break;

            for (const user of users) {
                worksheet.addRow({
                    no: no + 1,
                    name: user.full_name,
                    phone: user.phone,
                    email: user.email,
                    updated_at: user.updated_at,
                    status: user.status
                }).commit();
            }

            lastId = users[users.length - 1].id;
        }

        await workbook.commit();
    }

    async getUserByKeyword(keyword: string): Promise<UserDto[]> {
        console.log("🚀 ~ ReaderService ~ getReaderByKeyword ~ keyword:", keyword)
        if (keyword) {
            const where: Prisma.usersWhereInput = {
                OR: [
                    {
                        phone: {
                            contains: keyword,
                        },
                    },
                    {
                        full_name: {
                            contains: keyword,
                        },
                    },
                    {
                        user_code: {
                            contains: keyword,
                        }
                    }
                ]
            }
            const users = await prisma.users.findMany({ where, orderBy: { full_name: "asc" } });

            return users;
        }

        return [];
    }

    async register(dto: CreateUser) {
        const { username, password, email, phone, full_name } = dto;
        return await prisma.$transaction(async (tx) => {

            const existingAccount = await tx.accounts.findFirst({
                where: {
                    OR: [
                        { username: username },
                        { users: { email: email } }
                    ]
                },
                include: { users: true }
            });

            if (existingAccount) {
                if (existingAccount.username === username) {
                    throw new AlreadyExistsException("Tên đăng nhập");
                }
                if (existingAccount.users?.email === email) {
                    throw new AlreadyExistsException("Email");
                }
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newAccount = await tx.accounts.create({
                data: {
                    username: username,
                    password: hashedPassword,
                    failed_attempts: 0,
                    locked_until: null,
                    users: {
                        create: {
                            full_name: full_name,
                            email: email,
                            phone: phone,
                            lang: "vi",
                            status: "active",
                            role: "user",
                        }
                    }
                },
                include: { users: true }
            });

            const payload = {
                userId: newAccount.id,
                userName: newAccount.username,
                fullName: newAccount.users.full_name,
                role: "user",
                email: newAccount.users.email,
            };

            const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

            return {
                message: "Đăng ký tài khoản thành công",
                access_token: accessToken,
                user: {
                    id: newAccount.id,
                    username: newAccount.username,
                    full_name: newAccount.users.full_name,
                    email: newAccount.users.email,
                }
            };
        });
    }

    async getCartDetails(userId: number | null, items: { book_id: number; quantity: number }[]) {
        const bookIds = items.map((item) => item.book_id);
        const booksFromDb = await prisma.books.findMany({
            where: {
                id: {
                    in: bookIds,
                },
            },
        });

        const detailedItems = booksFromDb.map((book) => {
            const itemConfig = items.find((i) => i.book_id === book.id);
            const quantity = itemConfig ? itemConfig.quantity : 0;

            const price = Number(book.price);

            return {
                ...book,
                quantity: quantity,
                total_price: price * quantity,
            };
        });

        const subtotal = detailedItems.reduce((acc, cur) => acc + cur.total_price, 0);
        const shippingFee = subtotal > 0 ? 30000 : 0;
        const totalAmount = subtotal + shippingFee;

        return {
            user_id: userId,
            items: detailedItems,
            summary: {
                subtotal,
                shipping_fee: shippingFee,
                total_amount: totalAmount,
                total_quantity: detailedItems.reduce((acc, cur) => acc + cur.quantity, 0),
            },
        };
    }
}


export default UserPageService;