import { ReaderDto } from "../dto/reader.dto";
import { NotFoundException } from "../exceptions";
import { Prisma, publishers, readers } from "../generated/prisma/client";
import { buildPrismaFilter, prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";


interface FindPublisherQuery extends FindAllQuery {
    name?: string;
    email?: string;
    phone?: string;
}

export class PublisherService extends BaseService<publishers> {

    async store(data: Prisma.publishersCreateInput): Promise<publishers> {
        return prisma.publishers.create({ data });
    }

    async findAll({ pageIndex = 1, pageSize = 10, name = "", phone = "", email = "" }: FindPublisherQuery): Promise<PaginatedResult<publishers>> {
        const pageSearch = Math.max(1, Number(pageIndex)) || 1;
        const limitSearch = Number(pageSize) || 10;
        const where: Prisma.publishersWhereInput = {
            name: buildPrismaFilter("string", name),
            phone: buildPrismaFilter("string", phone),
            email: buildPrismaFilter("string", email)
        }

        const [list, total] = await Promise.all([
            prisma.publishers.findMany({
                skip: (pageSearch - 1) * limitSearch,
                take: limitSearch,
                orderBy: { name: "desc" },
                where
            }),
            prisma.publishers.count({ where })
        ])
        console.log("🚀 ~ PublisherService ~ findAll ~ list:", list)

        return { list, total };
    }

    async update(id: number, data: Partial<publishers>): Promise<publishers> {
        const res = await prisma.publishers.update({
            where: { id: Number(id) },
            data
        });

        if (!res) {
            throw new NotFoundException("Publisher");
        }

        return res;
    }

    async destroy(id: number): Promise<publishers> {
        return await prisma.publishers.delete({
            where: { id: id }
        });
    }

    async getAllPublisher(): Promise<publishers[]> {
        return await prisma.publishers.findMany();
    }
}