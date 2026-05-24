import { books, borrow_details, borrow_records, users } from "../generated/prisma/client";
import { BookDto } from "./book.dto";
import { UserDto } from "./user.dto";

export class BorrowDetailDto {
    id: number;
    users: UserDto;
    borrow_date: Date;
    due_date: Date;
    return_date: Date | null;
    status: string | null;
    borrow_code: string;
    books: BookDto[];

    constructor(detail: borrow_records & { users: users } & {
        borrow_details: (
            borrow_details & {
                books: books;
            }
        )[]
    }) {
        this.id = detail.id;
        this.users = new UserDto(detail.users);
        this.borrow_date = detail.borrow_date;
        this.due_date = detail.due_date;
        this.return_date = detail.return_date;
        this.status = detail.status;
        this.borrow_code = detail.borrow_code;
        this.books = detail.borrow_details.map(
            (item) => new BookDto(item.books)
        );
    }
}