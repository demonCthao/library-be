import { AlreadyExistsException, NotFoundException } from "../exceptions";
import { Prisma, users } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";

export class UserService extends BaseService<users> {

  async store(data: Prisma.usersCreateInput): Promise<users> {
    const checkExist = await prisma.users.findUnique({
      where: {
        card_id: data.card_id
      }
    });

    if (!!checkExist) {
      throw new AlreadyExistsException("User")
    }

    return prisma.users.create({ data });
  }

  async findAll({ page = 1, limit = 10 }: FindAllQuery = {}): Promise<PaginatedResult<users>> {
    const pageSearch = Number(page) || 1;
    const limitSearch = Number(limit) || 10;

    const [list, total] = await Promise.all([
      prisma.users.findMany({
        skip: (pageSearch - 1) * limitSearch,
        take: limitSearch,
        orderBy: { first_name: 'desc' }
      }),
      prisma.users.count()
    ]);

    return { list, total };
  }

  async update(id: string, data: Partial<users>): Promise<users> {
    const res = await prisma.users.update({
      where: { card_id: id },
      data
    });

    if (!res) {
      throw new NotFoundException('User');
    }

    return res;
  }

  async destroy(id: string): Promise<users> {
    return await prisma.users.delete({
      where: { card_id: id }
    });
  }
}


export default UserService;