import { ReaderDto } from "../dto/reader.dto";
import { NotFoundException } from "../exceptions";
import { Prisma, readers } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";


interface FindUserQuery extends FindAllQuery {
    fullName?: string;
    phone?: string;
    email?: string;
}

export class ReaderService extends BaseService<ReaderDto> {

    async store(data: Prisma.readersCreateInput): Promise<ReaderDto> {
        return prisma.readers.create({ data });
    }

    async findAll({ pageIndex = 1, pageSize = 10, fullName = "", phone = "", email = "" }: FindUserQuery): Promise<PaginatedResult<ReaderDto>> {
        const pageSearch = Math.max(1, Number(pageIndex)) || 1;
        const limitSearch = Number(pageSize) || 10;
        const where: Prisma.readersWhereInput = {
            full_name: {
                contains: fullName,
            },
            phone: {
                contains: phone
            }
            ,
            email: {
                contains: email
            }
        }

        const [list, total] = await Promise.all([
            prisma.readers.findMany({
                skip: (pageSearch - 1) * limitSearch,
                take: limitSearch,
                orderBy: { full_name: 'desc' },
                where
            }),
            prisma.readers.count({ where })
        ])

        return { list, total };
    }

    async update(id: number, data: Partial<readers>): Promise<ReaderDto> {
        const res = await prisma.readers.update({
            where: { id: Number(id) },
            data
        });

        if (!res) {
            throw new NotFoundException("Reader");
        }

        return res;
    }

    async destroy(id: number): Promise<ReaderDto> {
        return await prisma.readers.delete({
            where: { id: id }
        });
    }

    async getReaderByKeyword(keyword: string): Promise<ReaderDto[]> {
        console.log("🚀 ~ ReaderService ~ getReaderByKeyword ~ keyword:", keyword)
        if (keyword) {
            const where: Prisma.readersWhereInput = {
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
                        reader_code: {
                            contains: keyword,
                        }
                    }
                ]
            }
            const readers = await prisma.readers.findMany({ where, orderBy: { full_name: "asc" } });

            return readers;
        }

        return [];
    }
}