import { books } from "../generated/prisma/client";

export interface PurchaseOrderBookItem {
    book_id: number;
    qty: number;
    price: number;
}

export interface PurchaseOrderStore {
    user_id?: number;
    books: PurchaseOrderBookItem[];
    due_date: string;
    guest_name?: string;
    guest_phone?: string;
}