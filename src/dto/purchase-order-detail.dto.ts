import { ReaderDto } from "./reader.dto";
import { BookDto } from "./book.dto";
import { Decimal } from "@prisma/client/runtime/client";

type PurchaseOrderDetailPayload = {
    id: number;
    payment_status: string;
    purchase_order_code: string;
    guest_name: string | null;
    guest_phone: string | null;
    total_price: Decimal;
    created_at: Date;

    readers: {
        id: number;
        full_name: string;
        phone: string | null;
        email: string | null;
        reader_code: string;
        date_of_birth: Date | null;
        gender: any;
        address: string | null;
        created_at: Date | null;
    } | null;

    purchase_order_items: {
        books: {
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
        };
    }[];
};

export class PurchaseOrderDetailDto {
    id: number;
    reader?: ReaderDto;
    books: BookDto[];
    payment_status: string;
    purchase_order_code: string;
    guest_name: string | null;
    guest_phone: string | null;
    total_price: Decimal;
    created_at: Date;

    constructor(detail: PurchaseOrderDetailPayload) {
        this.id = detail.id;

        this.payment_status = detail.payment_status;
        this.purchase_order_code = detail.purchase_order_code;

        this.guest_name = detail.guest_name;
        this.guest_phone = detail.guest_phone;

        this.reader = detail.readers
            ? new ReaderDto(detail.readers)
            : undefined;

        this.books = detail.purchase_order_items.map(
            (item) => new BookDto(item.books)
        );
        this.total_price = detail.total_price;
        this.created_at = detail.created_at
    }
}