import { prisma } from "../lib/prisma";

export class UserService {
  static async getUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        skip,
        take: limit,
        orderBy: { card_id: "desc" },
      }),
      prisma.users.count(),
    ]);

    return {
      users,
      total,
    };
  }

  static async getUserById(id: string) {
    return prisma.users.findUnique({
      where: { card_id: id },
    });
  }

}
