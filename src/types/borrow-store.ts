import { books } from "../generated/prisma/client";

export interface BorrowStore {
    reader_id: number;
    books: { book_id: number, qty: number }[];
    due_date: string;
}