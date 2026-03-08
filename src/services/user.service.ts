import ExcelJS from "exceljs";
import { Response } from "express";
import { ForbiddenException, NotFoundException } from "../exceptions";
import { Prisma, users } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";

interface FindUserQuery extends FindAllQuery {
  fullName?: string;
  phone?: string
}

export class UserService extends BaseService<users> {

  async store(data: Prisma.usersCreateInput): Promise<users> {
    return prisma.users.create({ data });
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

  async update(id: number, data: Partial<users>): Promise<users> {
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
      where: { id: id }
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
}


export default UserService;