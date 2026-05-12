import dayjs from "dayjs";
import { NotFoundException } from "../exceptions";
import { Prisma, purchase_orders } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";
import { PurchaseOrderStore } from "../types/purchase-order-store";


interface FindUserQuery extends FindAllQuery {
    fullName?: string;
    phone?: string;
    email?: string;
}

export class PurchaseOrderService extends BaseService<purchase_orders> {

    async store(data: PurchaseOrderStore): Promise<purchase_orders> {
        var purchaseOrderCode = dayjs().format("YYYYMMDD");
        let nextNumber = 1;

        const lastPurchaseOrder = await prisma.purchase_orders.findFirst({
            where: {
                purchase_order_code: {
                    startsWith: purchaseOrderCode,
                },
            },
            orderBy: {
                purchase_order_code: "desc",
            },
        });

        if (lastPurchaseOrder) {
            const lastNumber = parseInt(lastPurchaseOrder.purchase_order_code.slice(8));
            nextNumber = lastNumber + 1;
        }

        purchaseOrderCode = `${purchaseOrderCode}${String(nextNumber).padStart(4, "0")}`;

        const books = data.books;
        const totalPrice = books.reduce(
            (sum, book) => sum + book.price,
            0
        );

        await prisma.$transaction(
            books.map((book) =>
                prisma.books.update({
                    where: { id: book.book_id },
                    data: {
                        stock_quantity: {
                            decrement: 1,
                        },
                    },
                })
            ),
        )

        const dateNow = new Date(dayjs().format("YYYY-MM-DD"))

        return prisma.purchase_orders.create({
            data: {
                reader_id: data.reader_id,
                guest_name: data.guest_name?? "Khách vãng lai",
                guest_phone: data.guest_phone?? "",
                created_at: dateNow,
                updated_at: dateNow,
                total_price: totalPrice,
                purchase_order_code: purchaseOrderCode,
                purchase_order_items: {
                    create: books.map(book => ({
                        book_id: book.book_id,
                        unit_price: book.price
                    }))
                }
            }
        });
    }

    async findAll({ pageIndex = 1, pageSize = 10, fullName = "", phone = "", email = "" }: FindUserQuery): Promise<PaginatedResult<purchase_orders>> {
        const pageSearch = Math.max(1, Number(pageIndex)) || 1;
        const limitSearch = Number(pageSize) || 10;
        const where: Prisma.readersWhereInput = {
            full_name: {
                contains: fullName,
            },
            phone: {
                contains: phone
            },
            email: {
                contains: email
            }
        }

        const [list, total] = await Promise.all([
            prisma.purchase_orders.findMany({
                skip: (pageSearch - 1) * limitSearch,
                take: limitSearch,
                orderBy: {
                    readers: {
                        full_name: 'desc'
                    }
                },
                include: {
                    readers: true
                },
                where: {
                    readers: where
                }
            }),
            prisma.purchase_orders.count({
                where: {
                    readers: where
                }
            })
        ])

        return { list, total };
    }

    async update(id: number, data: Partial<purchase_orders>): Promise<purchase_orders> {
        const res = await prisma.purchase_orders.update({
            where: { id: Number(id) },
            data
        });

        if (!res) {
            throw new NotFoundException("Purchase");
        }

        return res;
    }

    async destroy(id: number): Promise<purchase_orders> {
        return await prisma.purchase_orders.delete({
            where: { id: id }
        });
    }
}