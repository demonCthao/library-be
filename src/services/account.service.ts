import { AlreadyExistsException, BadRequestException } from "../exceptions";
import { accounts, Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { hashPass } from "../lib/utils";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";

const accountSafeSelect = {
  id: true,
  user_id: true,
  username: true,
  failed_attempts: true,
  locked_until: true,
  created_at: true,
  updated_at: true,
} as const

type AccountSafe = Prisma.accountsGetPayload<{
  select: typeof accountSafeSelect
}>

export class AccountService extends BaseService<AccountSafe> {
    async store(data: Prisma.accountsCreateInput): Promise<AccountSafe> {
        const checkExistAccount = await prisma.accounts.findUnique({
            where: { username: data.username }
        })

        if (checkExistAccount) {
            throw new AlreadyExistsException("Account");
        }

        const hash = await hashPass(data.password);

        return await prisma.accounts.create({
            data: {
                ...data,
                password: hash
            }
        });
    }

    async findAll({ pageIndex = 1, pageSize = 10 }: FindAllQuery = {}): Promise<PaginatedResult<AccountSafe>> {
        const pageSearch = Math.max(1, Number(pageIndex)) || 1;
        const limitSearch = Number(pageSize) || 10;

        const accounts = await prisma.accounts.findMany({
            skip: (pageSearch - 1) * limitSearch,
            take: limitSearch,
            orderBy: { username: 'desc' },
            select: {
                id: true,
                user_id: true,
                username: true,
                failed_attempts: true,
                locked_until: true,
                created_at: true,
                updated_at: true,
            },
        })

        return { list: accounts, total: accounts.length }
    }

    async update(id: string, data: Partial<accounts>): Promise<AccountSafe> {
        const checkExistAccount = await prisma.accounts.findFirst({
            where: { username: data.username }
        })

        if (!checkExistAccount) {
            throw new AlreadyExistsException("Account");
        }

        const hash = await hashPass(data.password ?? "");

        return await prisma.accounts.update({
            where: { username: data.username },
            data: {
                ...data,
                password: hash
            }
        });
    }

    async destroy(id: string): Promise<AccountSafe> {
        throw new BadRequestException();
    }
}