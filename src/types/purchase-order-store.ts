import { books } from "../generated/prisma/client";

export interface PurchaseOrderStore {
    reader_id?: number;
    books: {
        book_id: number;
        price: number
    }[];
    due_date: string;
    guest_name?: string;
    guest_phone?: string;
}