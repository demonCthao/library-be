import dayjs from "dayjs";
import { NotFoundException } from "../exceptions";
import { Prisma, purchase_orders } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { FindAllQuery } from "../types/search-query";
import { BaseService } from "./base.service";
import { PurchaseOrderStore } from "../types/purchase-order-store";
import { PurchaseOrderDetailDto } from "../dto/purchase-order-detail.dto";


interface FindUserQuery extends FindAllQuery {
    readerName?: string;
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
                guest_name: data.guest_name ?? "Khách vãng lai",
                guest_phone: data.guest_phone ?? "",
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

    async findAll({
        pageIndex = 1,
        pageSize = 10,
        readerName = "",
        phone = "",
        email = ""
    }: FindUserQuery): Promise<PaginatedResult<purchase_orders>> {

        const pageSearch = Math.max(1, Number(pageIndex)) || 1;
        const limitSearch = Number(pageSize) || 10;

        const conditions: Prisma.purchase_ordersWhereInput[] = [];

        // ===== SEARCH NAME =====
        if (readerName) {
            conditions.push({
                OR: [
                    // member
                    {
                        readers: {
                            is: {
                                full_name: {
                                    contains: readerName
                                }
                            }
                        }
                    },

                    // guest
                    {
                        guest_name: {
                            contains: readerName
                        }
                    }
                ]
            });
        }

        // ===== SEARCH PHONE =====
        if (phone) {
            conditions.push({
                OR: [
                    // member
                    {
                        readers: {
                            is: {
                                phone: {
                                    contains: phone
                                }
                            }
                        }
                    },

                    // guest
                    {
                        guest_phone: {
                            contains: phone
                        }
                    }
                ]
            });
        }

        // ===== SEARCH EMAIL =====
        if (email) {
            conditions.push({
                readers: {
                    is: {
                        email: {
                            contains: email
                        }
                    }
                }
            });
        }

        const where: Prisma.purchase_ordersWhereInput =
            conditions.length > 0
                ? {
                    AND: conditions
                }
                : {};

        const [list, total] = await Promise.all([
            prisma.purchase_orders.findMany({
                skip: (pageSearch - 1) * limitSearch,
                take: limitSearch,

                where,

                include: {
                    readers: true
                },

                orderBy: {
                    id: 'desc'
                }
            }),

            prisma.purchase_orders.count({
                where
            })
        ]);

        return {
            list,
            total
        };
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

    async getPurchaseOrderDetailById(id: number): Promise<PurchaseOrderDetailDto> {
        const purchaseOrder = await prisma.purchase_orders.findUnique({
            where: { id },
            include: {
                readers: true,
                purchase_order_items: {
                    include: {
                        books: true
                    }
                },
            }
        });

        if (!purchaseOrder) {
            throw new NotFoundException("Purchase Order detail");
        }

        return new PurchaseOrderDetailDto(purchaseOrder);
    }
}