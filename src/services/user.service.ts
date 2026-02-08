import { NotFoundException } from "../exceptions";
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

    const users = await prisma.users.findMany({
      skip: (pageSearch - 1) * limitSearch,
      take: limitSearch,
      orderBy: { full_name: 'desc' },
      where: {
        full_name: {
          contains: fullName,
        },
        phone: {
          contains: phone
        }
      },
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
    })

    return { list: users, total: users.length };
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
}


export default UserService;