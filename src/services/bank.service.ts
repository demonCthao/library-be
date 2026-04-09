import { bank_accounts, Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { BaseService } from "./base.service";

class BankService extends BaseService<bank_accounts> {
    async store(data: Prisma.bank_accountsCreateInput): Promise<bank_accounts> {
        return prisma.bank_accounts.create({ data });
    }

    async findAll(): Promise<PaginatedResult<bank_accounts>> {
        throw Error()
    }

    async update(id: number, data: Partial<bank_accounts>): Promise<bank_accounts> {
        return await prisma.bank_accounts.update({
            where: { id: Number(id) },
            data
        });

    }

    async destroy(id: number): Promise<bank_accounts> {
        return await prisma.bank_accounts.delete({
            where: { id: id }
        });
    }

    async getAllBankAccounts() {
        return prisma.bank_accounts.findMany();
    }
}

export default BankService