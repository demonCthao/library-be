import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { Response } from "express";
import { NotFoundException } from "../exceptions";
import { books, Prisma } from "../generated/prisma/client";
import { buildPrismaFilter, prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";

interface FindBookQuery extends FindAllQuery {
  title?: string;
  description?: string;
  publish_year?: string;
  category_id?: string;
}

class BookService extends BaseService<books> {
  async store(data: Prisma.booksCreateInput): Promise<books> {
    return prisma.books.create({ data });
  }

  async findAll({ pageIndex = 1, pageSize = 10, title = "", description = "", publish_year = "", category_id = "" }: FindBookQuery): Promise<PaginatedResult<books>> {
    const pageSearch = Math.max(1, Number(pageIndex)) || 1;
    const limitSearch = Number(pageSize) || 10;

    const where: Prisma.booksWhereInput = {
      title: title ? { contains: title } : undefined,
      description: description ? { contains: description } : undefined,
      publish_year: buildPrismaFilter("number", publish_year),
      category_id: buildPrismaFilter("number", category_id),
    };

    const [list, total] = await Promise.all([
      prisma.books.findMany({
        skip: (pageSearch - 1) * limitSearch,
        take: limitSearch,
        orderBy: { title: 'desc' },
        where: where
      }),
      prisma.books.count({
        where
      })
    ])

    return { list, total };
  }

  async update(id: number, data: Partial<books>, file?: Express.Multer.File): Promise<books> {

    const existingBook = await prisma.books.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!existingBook) {
      throw new NotFoundException('Book');
    }

    if (file) {
      // Xóa ảnh cũ
      if (existingBook.avatar_path) {
        const oldPath = path.join(
          process.cwd(),
          existingBook.avatar_path
        );

        if (fs.existsSync(oldPath)) {
          await fs.promises.unlink(oldPath);
        }
      }

      data.avatar_path = `/uploads/books/${file.filename}`;
    }

    return await prisma.books.update({
      where: { id: Number(id) },
      data
    });

  }

  async destroy(id: number): Promise<books> {
    return await prisma.books.delete({
      where: { id: id }
    });
  }

  async exportBooks(res: Response) {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=books.xlsx"
    );

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res
    });

    const worksheet = workbook.addWorksheet("Books");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 40 },
      { header: "Publish Year", key: "publish_year", width: 15 },
    ];

    const batchSize = 1000;
    let lastId: number | null = null;

    while (true) {
      const books: books[] = await prisma.books.findMany({
        take: batchSize,
        ...(lastId && { cursor: { id: lastId }, skip: 1 }),
        orderBy: { id: "asc" }
      });

      if (books.length === 0) break;

      for (const book of books) {
        worksheet.addRow({
          id: book.id,
          title: book.title,
          description: book.description,
          publish_year: book.publish_year
        }).commit();
      }

      lastId = books[books.length - 1].id;
    }

    await workbook.commit();
  }

  async getBookByKeyword(keyword: string): Promise<books[]> {
    if (keyword) {
      return await prisma.books.findMany({
        where: {
          title: {
            contains: keyword
          }
        }
      }); 
    }

    return [];
  }
}

export default BookService