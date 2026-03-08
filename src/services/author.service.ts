import ExcelJS from "exceljs";
import { Response } from "express";
import { NotFoundException } from "../exceptions";
import { authors, Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";

interface FindAuthorQuery extends FindAllQuery {
  name?: string;
  bio?: string;
}

class AuthorService extends BaseService<authors> {
  async store(data: Prisma.authorsCreateInput): Promise<authors> {
    return prisma.authors.create({ data });
  }

  async findAll({ pageIndex = 1, pageSize = 10, name = "", bio = "" }: FindAuthorQuery): Promise<PaginatedResult<authors>> {
    const pageSearch = Math.max(1, Number(pageIndex)) || 1;
    const limitSearch = Number(pageSize) || 10;

    const where: Prisma.authorsWhereInput = {
      name: name ? { contains: name } : undefined,
      bio: bio ? { contains: bio } : undefined
    };

    const [list, total] = await Promise.all([
      prisma.authors.findMany({
        skip: (pageSearch - 1) * limitSearch,
        take: limitSearch,
        orderBy: { name: 'desc' },
        where: where
      }),
      prisma.authors.count({
        where
      })
    ])

    return { list, total };
  }

  async update(id: number, data: Partial<authors>): Promise<authors> {

    const existingAuth = await prisma.authors.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!existingAuth) {
      throw new NotFoundException("Author");
    }

    return await prisma.authors.update({
      where: { id: Number(id) },
      data
    });

  }

  async destroy(id: number): Promise<authors> {
    return await prisma.authors.delete({
      where: { id: id }
    });
  }

  async exportAuthors(res: Response) {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=authors.xlsx"
    );

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res
    });

    const worksheet = workbook.addWorksheet("Authors");

    worksheet.columns = [
      { header: "NO", key: "no", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Biography", key: "bio", width: 100 },
    ];

    let lastId: number | null = null;
    let no: number = 0;

    while (true) {
      const authors: authors[] = await prisma.authors.findMany({
        take: 1000,
        ...(lastId && { cursor: { id: lastId }, skip: 1 }),
        orderBy: { id: "asc" }
      });

      if (authors.length === 0) break;

      for (const auth of authors) {
        no = no + 1;
        worksheet.addRow({
          no,
          name: auth.name,
          bio: auth.bio
        }).commit();
      }

      lastId = authors[authors.length - 1].id;
    }

    await workbook.commit();
  }
}

export default AuthorService