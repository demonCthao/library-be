import dayjs from "dayjs";
import { NotFoundException } from "../exceptions";
import { Prisma, purchase_order_items, purchase_orders } from "../generated/prisma/client";
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

        // =========================
        // GENERATE CODE
        // =========================

        let purchaseOrderCode = dayjs().format("YYYYMMDD");
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

            const lastNumber = parseInt(
                lastPurchaseOrder.purchase_order_code.slice(8)
            );

            nextNumber = lastNumber + 1;
        }

        purchaseOrderCode =
            `${purchaseOrderCode}${String(nextNumber).padStart(4, "0")}`;

        // =========================
        // PREPARE DATA
        // =========================

        const books = data.books;

        // total = price * qty

        const totalPrice = books.reduce(
            (sum, book) => sum + (book.price * book.qty),
            0
        );

        const dateNow = new Date(dayjs().format("YYYY-MM-DD"));

        // =========================
        // CHECK STOCK
        // =========================

        const dbBooks = await prisma.books.findMany({
            where: {
                id: {
                    in: books.map(book => book.book_id)
                }
            }
        });

        for (const item of books) {

            const dbBook = dbBooks.find(
                b => b.id === item.book_id
            );

            if (!dbBook) {
                throw new Error(`Book ID ${item.book_id} not found`);
            }

            if (dbBook.stock_quantity < item.qty) {
                throw new Error(
                    `Sách "${dbBook.title}" không đủ số lượng tồn`
                );
            }
        }

        // =========================
        // TRANSACTION
        // =========================

        return prisma.$transaction(async (tx) => {

            // UPDATE STOCK

            for (const item of books) {

                await tx.books.update({

                    where: {
                        id: item.book_id
                    },

                    data: {
                        stock_quantity: {
                            decrement: item.qty
                        }
                    }
                });
            }

            // CREATE ORDER

            const purchaseOrder = await tx.purchase_orders.create({

                data: {

                    user_id: data.user_id,

                    guest_name:
                        data.guest_name ?? "Khách vãng lai",

                    guest_phone:
                        data.guest_phone ?? "",

                    created_at: dateNow,

                    updated_at: dateNow,

                    total_price: totalPrice,

                    purchase_order_code: purchaseOrderCode,

                    purchase_order_items: {

                        create: books.map(book => ({

                            book_id: book.book_id,

                            quantity: book.qty,

                            unit_price: book.price,
                        }))
                    }
                },

                include: {
                    purchase_order_items: true
                }
            });

            return purchaseOrder;
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
                        users: {
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
                        users: {
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
                users: {
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
                    users: true
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

        // update book

        return res;
    }

    async destroy(id: number): Promise<purchase_orders> {
        return await prisma.$transaction(async (tx) => {

            // Lấy order + items
            const purchaseOrder = await tx.purchase_orders.findUnique({
                where: { id },
                include: {
                    purchase_order_items: true,
                },
            });

            if (!purchaseOrder) {
                throw new Error("Purchase order not found");
            }

            // Hoàn lại số lượng sách
            await Promise.all(
                purchaseOrder.purchase_order_items.map((item) =>
                    tx.books.update({
                        where: {
                            id: item.book_id,
                        },
                        data: {
                            stock_quantity: {
                                increment: 1,
                            },
                        },
                    })
                )
            );

            // Xoá các item
            await tx.purchase_order_items.deleteMany({
                where: {
                    purchase_order_id: id,
                },
            });

            // Xoá order
            return await tx.purchase_orders.delete({
                where: {
                    id,
                },
            });
        });
    }

    async getPurchaseOrderDetailById(id: number): Promise<PurchaseOrderDetailDto> {
        const purchaseOrder = await prisma.purchase_orders.findUnique({
            where: { id },
            include: {
                users: true,
                purchase_order_items: {
                    include: {
                        books: true,
                    }
                },
            }
        });

        if (!purchaseOrder) {
            throw new NotFoundException("Purchase Order detail");
        }

        return new PurchaseOrderDetailDto(purchaseOrder);
    }

    async updatePurchaseOrderBook(
        id: number,
        data: purchase_order_items[],
    ) {
        const purchaseOrder = await prisma.purchase_orders.findUnique({
            where: { id },
        });

        if (!purchaseOrder) {
            throw new NotFoundException("Purchase Order detail");
        }

        await prisma.$transaction(async (tx) => {

            // Lấy item cũ
            const oldItems = await tx.purchase_order_items.findMany({
                where: {
                    purchase_order_id: id,
                },
            });

            /**
             * Hoàn lại stock cũ
             */
            await Promise.all(
                oldItems.map((item) =>
                    tx.books.update({
                        where: {
                            id: item.book_id,
                        },
                        data: {
                            stock_quantity: {
                                increment: item.quantity,
                            },
                        },
                    })
                )
            );

            /**
             * Trừ stock mới
             */
            await Promise.all(
                data.map((item) =>
                    tx.books.update({
                        where: {
                            id: item.book_id,
                        },
                        data: {
                            stock_quantity: {
                                decrement: item.quantity,
                            },
                        },
                    })
                )
            );

            /**
             * Update total price
             */
            await tx.purchase_orders.update({
                where: { id },
                data: {
                    total_price: data.reduce((sum, item) => {
                        return sum + item.quantity * Number(item.unit_price);
                    }, 0),
                },
            });

            /**
             * Xoá item cũ
             */
            await tx.purchase_order_items.deleteMany({
                where: {
                    purchase_order_id: id,
                },
            });

            /**
             * Tạo item mới
             */
            await tx.purchase_order_items.createMany({
                data: data.map((item) => ({
                    purchase_order_id: id,
                    book_id: item.book_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                })),
            });
        });
    }
}