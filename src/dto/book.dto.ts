import { Decimal } from "@prisma/client/runtime/client";


type BookPayload = {
    id: number;
    isbn: string | null;
    title: string;
    description: string | null;
    publish_year: number | null;
    language: string | null;
    pages: number | null;
    publisher_id: number | null;
    avatar_path: string | null;
    price: Decimal;
    quantity: number | null
};

export class BookDto {
    id: number;
    title: string;
    description: string | null;
    publish_year: number | null;
    language: string | null;
    pages: number | null;
    avatar_path: string | null;
    price: Decimal;
    quantity?: number

    constructor(book: BookPayload, quantity?: number) {
        this.id = book.id;
        this.title = book.title;
        this.description = book.description;
        this.publish_year = book.publish_year;
        this.language = book.language;
        this.pages = book.pages;
        this.avatar_path = book.avatar_path;
        this.price = book.price;
        this.quantity = quantity
    }
}