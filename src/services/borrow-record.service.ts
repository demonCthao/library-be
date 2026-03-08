import { BorrowDetailDto } from "../dto/borrow-detail.dto";
import { NotFoundException } from "../exceptions";
import { borrow_records, Prisma } from "../generated/prisma/client";
import { buildPrismaFilter, prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";

interface FindBorrowRecordQuery extends FindAllQuery {
  readerName?: string;
  phone?: string;
  dueDate?: string;
  borrowDate?: string;
  returnDate?: string;
  status?: "borrowing" | "returned" | "overdue" | "";
}

class BorrowRecordService extends BaseService<borrow_records> {
  async store(data: Prisma.borrow_recordsCreateInput): Promise<borrow_records> {
    return prisma.borrow_records.create({ data });
  }

  async findAll({ pageIndex = 1, pageSize = 10, borrowDate = "", readerName = "", phone = "", dueDate = "", returnDate = "", status = "" }: FindBorrowRecordQuery): Promise<PaginatedResult<borrow_records>> {
    const pageSearch = Math.max(1, Number(pageIndex)) || 1;
    const limitSearch = Number(pageSize) || 10;

    const where: Prisma.borrow_recordsWhereInput = {
      readers: readerName || phone ? { full_name: buildPrismaFilter("string", readerName), phone: buildPrismaFilter("string", phone) } : undefined,
      borrow_date: borrowDate ? { gte: new Date(borrowDate) } : undefined,
      due_date: dueDate ? { gte: new Date(dueDate) } : undefined,
      return_date: returnDate ? { gte: new Date(returnDate) } : undefined,
      status: status ? { equals: status } : undefined,
    };

    const [list, total] = await Promise.all([
      prisma.borrow_records.findMany({
        skip: (pageSearch - 1) * limitSearch,
        take: limitSearch,
        orderBy: { due_date: "desc" },
        where: where,
        include: {
          readers: {
            select: {
              full_name: true,
              phone: true,
              email: true
            }
          }
        }
      }),
      prisma.borrow_records.count({
        where
      })
    ])

    return { list, total };
  }

  async update(id: number, data: Partial<borrow_records>): Promise<borrow_records> {

    const existingBook = await prisma.borrow_records.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!existingBook) {
      throw new NotFoundException("Borrow Record");
    }

    return await prisma.borrow_records.update({
      where: { id: Number(id) },
      data
    });

  }

  async destroy(id: number): Promise<borrow_records> {
    return await prisma.borrow_records.delete({
      where: { id: id }
    });
  }

  async getBorrowDetailById(id: number): Promise<BorrowDetailDto> {
    const borrow = await prisma.borrow_records.findUnique({
      where: { id },
      include: {
        readers: true,
        borrow_details: {
          include: {
            book_copies: {
              include: {
                books: true
              }
            }
          }
        }
      }
    });

    if (!borrow) {
      throw new NotFoundException("Borrow detail");
    }

    return new BorrowDetailDto(borrow);
  }
}

export default BorrowRecordService