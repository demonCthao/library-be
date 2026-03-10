import { books } from "../generated/prisma/client";

export interface BorrowStore {
    reader_id: number;
    books: number[];
    due_date: string;
}