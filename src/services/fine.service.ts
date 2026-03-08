import { NotFoundException } from "../exceptions";
import { fines, Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";


interface FindFineQuery extends FindAllQuery {
    name?: string;
    email?: string;
    phone?: string;
    dueDate?: string;
    returnDate?: string;
}

export class FineService extends BaseService<fines> {

    async store(data: Prisma.finesCreateInput): Promise<fines> {
        return prisma.fines.create({ data });
    }

    async findAll({ pageIndex = 1, pageSize = 10, name = "", phone = "", email = "", dueDate = "", returnDate = "" }: FindFineQuery): Promise<PaginatedResult<fines>> {
        const pageSearch = Math.max(1, Number(pageIndex)) || 1;
        const limitSearch = Number(pageSize) || 10;
        const borrowWhere: Prisma.borrow_recordsWhereInput = {
            readers: {
                ...(name && { full_name: { contains: name } }),
                ...(phone && { phone: { contains: phone } }),
                ...(email && { email: { contains: email } })
            },
            ...(dueDate && { due_date: new Date(dueDate) }),
            ...(returnDate && { return_date: new Date(returnDate) })
        };

        const where: Prisma.finesWhereInput = {
            borrow_records: Object.keys(borrowWhere).length ? borrowWhere : undefined
        };

        const [list, total] = await Promise.all([
            prisma.fines.findMany({
                skip: (pageSearch - 1) * limitSearch,
                take: limitSearch,
                orderBy: { borrow_records: { return_date: "desc" } },
                where,
                include: {
                    borrow_records: {
                        include: {
                            readers: true
                        }
                    }
                }
            }),
            prisma.fines.count({ where })
        ])

        return { list, total };
    }

    async update(id: number, data: Partial<fines>): Promise<fines> {
        const res = await prisma.fines.update({
            where: { id: Number(id) },
            data
        });

        if (!res) {
            throw new NotFoundException("Fine");
        }

        return res;
    }

    async destroy(id: number): Promise<fines> {
        return await prisma.fines.delete({
            where: { id: id }
        });
    }
}