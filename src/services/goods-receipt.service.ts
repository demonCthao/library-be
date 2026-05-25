import ExcelJS from "exceljs";
import { Response } from "express";
import { AlreadyExistsException, NotFoundException } from "../exceptions";
import { goods_receipts, Prisma } from "../generated/prisma/client";
import { buildPrismaFilter, prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";

interface FindGoodsReceiptQuery extends FindAllQuery {
    code?: string;
    publisher_id?: string;
}

interface CreateGoodsReceiptDetailInput {
    book_id: number;
    quantity: number;
    import_price: number;
}

interface CreateGoodsReceiptInput {
    code: string;
    publisher_id: number;
    created_by: number;
    details: CreateGoodsReceiptDetailInput[];
}

class GoodsReceiptService extends BaseService<goods_receipts> {
    async store(data: Omit<CreateGoodsReceiptInput, 'code'>): Promise<goods_receipts> {
        return await prisma.$transaction(async (tx) => {
            const now = new Date();
            const year = now.getFullYear().toString().slice(-2);
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');

            const prefix = `PN${year}${month}${day}`;

            const startOfDay = new Date(now.setHours(0, 0, 0, 0));
            const endOfDay = new Date(now.setHours(23, 59, 59, 999));

            const countToday = await tx.goods_receipts.count({
                where: {
                    created_at: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                }
            });

            const nextSequence = String(countToday + 1).padStart(3, '0');
            const generatedCode = `${prefix}${nextSequence}`;

            const newReceipt = await tx.goods_receipts.create({
                data: {
                    code: generatedCode,
                    publisher_id: Number(data.publisher_id),
                    created_by: Number(data.created_by),
                    goods_receipt_details: {
                        create: data.details.map((item) => ({
                            book_id: Number(item.book_id),
                            quantity: Number(item.quantity),
                            import_price: Number(item.import_price),
                        }))
                    }
                }
            });

            // 3. TỰ ĐỘNG CẬP NHẬT TĂNG SỐ LƯỢNG KHO SÁCH
            for (const item of data.details) {
                const existingBook = await tx.books.findUnique({
                    where: { id: Number(item.book_id) }
                });

                if (!existingBook) {
                    throw new NotFoundException(`Sách với ID ${item.book_id}`);
                }

                await tx.books.update({
                    where: { id: Number(item.book_id) },
                    data: {
                        stock_quantity: {
                            increment: Number(item.quantity)
                        },
                        available_quantity: {
                            increment: Number(item.quantity)
                        }
                    }
                });
            }

            return newReceipt;
        });
    }

    async findAll({ pageIndex = 1, pageSize = 10, code = "", publisher_id = "" }: FindGoodsReceiptQuery): Promise<PaginatedResult<goods_receipts>> {
        const pageSearch = Math.max(1, Number(pageIndex)) || 1;
        const limitSearch = Number(pageSize) || 10;

        const where: Prisma.goods_receiptsWhereInput = {
            code: code ? { contains: code } : undefined,
            publisher_id: publisher_id ? Number(publisher_id) : undefined,
        };

        const [list, total] = await Promise.all([
            prisma.goods_receipts.findMany({
                skip: (pageSearch - 1) * limitSearch,
                take: limitSearch,
                orderBy: { created_at: 'desc' },
                where: where,
                include: {
                    goods_receipt_details: {
                        include: {
                            books: true
                        }
                    }
                }
            }),
            prisma.goods_receipts.count({
                where
            })
        ]);

        return { list, total };
    }

    async update(id: number, data: Partial<goods_receipts>): Promise<goods_receipts> {
        const existingReceipt = await prisma.goods_receipts.findUnique({
            where: { id: Number(id) }
        });

        if (!existingReceipt) {
            throw new NotFoundException('GoodsReceipt');
        }

        return await prisma.goods_receipts.update({
            where: { id: Number(id) },
            data
        });
    }

    async destroy(id: number): Promise<goods_receipts> {
        const existingReceipt = await prisma.goods_receipts.findUnique({
            where: { id: Number(id) }
        });

        if (!existingReceipt) {
            throw new NotFoundException('GoodsReceipt');
        }

        return await prisma.goods_receipts.delete({
            where: { id: Number(id) }
        });
    }

    async exportGoodsReceipts(res: Response) {
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=goods_receipts.xlsx"
        );

        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            stream: res
        });

        const worksheet = workbook.addWorksheet("GoodsReceipts");

        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Mã Phiếu", key: "code", width: 25 },
            { header: "ID Nhà Xuất Bản", key: "publisher_id", width: 15 },
            { header: "Người Tạo (ID)", key: "created_by", width: 15 },
            { header: "Ngày Nhập Kho", key: "created_at", width: 25 },
        ];

        const batchSize = 1000;
        let lastId: number | null = null;

        while (true) {
            const receipts: goods_receipts[] = await prisma.goods_receipts.findMany({
                take: batchSize,
                ...(lastId && { cursor: { id: lastId }, skip: 1 }),
                orderBy: { id: "asc" }
            });

            if (receipts.length === 0) break;

            for (const receipt of receipts) {
                worksheet.addRow({
                    id: receipt.id,
                    code: receipt.code,
                    publisher_id: receipt.publisher_id,
                    created_by: receipt.created_by,
                    created_at: receipt.created_at
                }).commit();
            }

            lastId = receipts[receipts.length - 1].id;
        }

        await workbook.commit();
    }
}

export default GoodsReceiptService;