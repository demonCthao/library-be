import { users } from "../generated/prisma/client";

export class UserDto {
    id: number;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    status: any;
    role: any;
    lang: string | null;
    created_at: Date;
    updated_at: Date;
    avatar_path: string | null;
    user_code: string | null;
    address: string | null

    constructor(user: users) {
        this.id = user.id;
        this.full_name = user.full_name;
        this.email = user.email;
        this.phone = user.phone;
        this.status = user.status;
        this.role = user.role;
        this.lang = user.lang;
        this.created_at = user.created_at;
        this.updated_at = user.updated_at;
        this.avatar_path = user.avatar_path;
        this.user_code = user.user_code;
        this.address = user.address
    }
}