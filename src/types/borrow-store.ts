import { books } from "../generated/prisma/client";

interface BorrowStore {
    readerID: number;
    books: books[];
    borrowDate: string;
    dueDate: string;
}