import ExcelJS from "exceljs";
import { Response } from "express";
import { NotFoundException } from "../exceptions";
import { categories, Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";

interface FindCategoryQuery extends FindAllQuery {
    name?: string;
}

class CategoryService extends BaseService<categories> {
    async store(data: Prisma.categoriesCreateInput): Promise<categories> {
        return prisma.categories.create({ data });
    }

    async findAll({
        pageIndex = 1,
        pageSize = 10,
        name = ""
    }: FindCategoryQuery): Promise<PaginatedResult<categories>> {
        const page = Math.max(1, Number(pageIndex) || 1);
        const limit = Math.max(1, Number(pageSize) || 10);
        const offset = (page - 1) * limit;
        const hasFilter = !!name;
        const nameFilter = `%${name}%`;
        const whereClause = hasFilter
            ? Prisma.sql`WHERE name LIKE ${nameFilter}`
            : Prisma.empty;

        const [list, totalResult] = await Promise.all([
            prisma.$queryRaw<categories[]>
                (Prisma.sql`
                    SELECT id, name, other_category_names, parent_id
                    FROM category_with_children
                    ${whereClause}
                    ORDER BY name DESC
                    LIMIT ${limit}
                    OFFSET ${offset}
                `),

            prisma.$queryRaw<{ count: number }[]>
                (Prisma.sql`
                    SELECT COUNT(*) as count
                    FROM categories
                    ${whereClause}
                `)
        ]);

        const total = Number(totalResult[0]?.count ?? 0);

        return {
            list,
            total
        };
    }

    async update(id: number, data: Partial<categories>): Promise<categories> {
        const res = await prisma.categories.update({
            where: { id: Number(id) },
            data: {
                name: data.name,
                parent_id: data.parent_id
            }
        });

        if (!res) {
            throw new NotFoundException('Category');
        }

        return res;
    }

    async destroy(id: number): Promise<categories> {
        return await prisma.categories.delete({
            where: { id: id }
        });
    }

    async getAllCategories(): Promise<categories[]> {
        return await prisma.categories.findMany();
    }

    async exportCategories(res: Response) {
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
            { header: "Parent", key: "other_category_names", width: 100 }
        ];

        let lastId: number | null = null;
        let no: number = 0;

        while (true) {
            const categories: categories[] = await
                prisma.$queryRaw<categories[]>
                    (Prisma.sql`
                    SELECT id, name, other_category_names
                    FROM category_with_children
                    WHERE id > ${lastId}
                    ORDER BY id ASC
                    LIMIT 1000
                `);

            if (categories.length === 0) break;

            for (const c of categories) {
                worksheet.addRow({
                    no: no + 1,
                    name: c.name,
                    parent: c.other_category_names
                }).commit();
            }

            lastId = categories[categories.length - 1].id;
        }

        await workbook.commit();
    }

}

export default CategoryService;