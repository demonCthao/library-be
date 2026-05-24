import ExcelJS from "exceljs";
import { Response } from "express";
import { ForbiddenException, NotFoundException } from "../exceptions";
import { Prisma, users } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";
import path from "path";
import fs from "fs";
import dayjs from "dayjs";
import { UserDto } from "../dto/user.dto";

interface FindUserQuery extends FindAllQuery {
  fullName?: string;
  phone?: string
}

export class UserService extends BaseService<users> {

  async store(data: Prisma.usersCreateInput): Promise<users> {
    var userCode = dayjs().format("YYYYMMDD");
    let nextNumber = 1;

    const lastUser = await prisma.users.findFirst({
      where: {
        user_code: {
          startsWith: userCode,
        },
      },
      orderBy: {
        user_code: "desc",
      },
    });

    if (lastUser && lastUser?.user_code) {
      const lastNumber = parseInt(lastUser?.user_code?.slice(8));
      nextNumber = lastNumber + 1;
    }

    userCode = `USR${userCode}${String(nextNumber).padStart(4, "0")}`;

    return prisma.users.create({
      data: {
        ...data
      }
    });
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
        orderBy: { full_name: 'desc' },
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
      throw new NotFoundException('User');
    }

    return res;
  }

  async destroy(id: number): Promise<users> {
    return await prisma.users.delete({
      where: { id: id }
    });
  }

  async getProfileByID(id: number, authUser: { userId: number; role: string }): Promise<users> {
    const user = await prisma.users.findUnique({
      where: { id: id },
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
    });

    if (authUser.userId !== id) {
      throw new ForbiddenException("You are not allowed to view this user")
    }

    if (!user) {
      throw new NotFoundException('User');
    }

    return user;
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
}


export default UserService;