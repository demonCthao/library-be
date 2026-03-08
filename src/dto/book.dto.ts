import { books } from "../generated/prisma/client";

export class BookDto {
    id: number;
    title: string;
    description: string | null;
    publish_year: number | null;
    language: number | null;
    pages: number | null;
    avatar_path: string | null

    constructor(book: books) {
        this.id = book.id;
        this.title = book.title;
        this.description = book.description;
        this.publish_year = book.publish_year;
        this.language = book.publish_year;
        this.pages = book.pages;
        this.avatar_path = book.avatar_path;
    }
} 