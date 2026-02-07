import { AlreadyExistsException, BadRequestException } from "../exceptions";
import { accounts, Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { hashPass } from "../lib/utils";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";

export class AccountService extends BaseService<accounts> {
    async store(data: Prisma.accountsCreateInput): Promise<accounts> {
        const checkExistAccount = await prisma.accounts.findUnique({
            where: { user_name: data.user_name }
        })

        if (checkExistAccount) {
            throw new AlreadyExistsException("Account");
        }

        const hash = await hashPass(data.user_pass);

        return prisma.accounts.create({
            data: {
                ...data,
                user_pass: hash
            }
        });
    }

    async findAll({ page = 1, limit = 10 }: FindAllQuery = {}): Promise<PaginatedResult<accounts>> {
        throw new BadRequestException();
    }

    async update(id: string, data: Partial<accounts>): Promise<accounts> {
        throw new BadRequestException();
    }

    async destroy(id: string): Promise<accounts> {
        throw new BadRequestException();
    }
}