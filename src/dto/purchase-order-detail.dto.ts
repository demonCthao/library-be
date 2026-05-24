import { Decimal } from "@prisma/client/runtime/client";
import { BookDto } from "./book.dto";
import { UserDto } from "./user.dto";

type PurchaseOrderDetailPayload = {
    id: number;
    payment_status: string;
    purchase_order_code: string;
    guest_name: string | null;
    guest_phone: string | null;
    total_price: Decimal;
    created_at: Date;

    users: UserDto | null;

    purchase_order_items: {
        quantity?: number;
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
            quantity: number | null
        };
    }[];
};

export class PurchaseOrderDetailDto {
    id: number;
    users?: UserDto;
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

        this.users = detail.users
            ? new UserDto(detail.users)
            : undefined;

        this.books = detail.purchase_order_items.map(
            (item) => new BookDto(item.books, item.quantity?? 0)
        );
        this.total_price = detail.total_price;
        this.created_at = detail.created_at
    }
}