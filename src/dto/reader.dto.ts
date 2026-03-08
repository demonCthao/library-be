import { readers, readers_gender } from "../generated/prisma/client";

export class ReaderDto {
    id: number;
    reader_code: string;
    full_name: string;
    date_of_birth: Date | null;
    gender: readers_gender | null;
    email: string | null;
    phone: string | null;
    address: string | null;

    constructor(reader: readers) {
        this.id = reader.id;
        this.reader_code = reader.reader_code;
        this.full_name = reader.full_name;
        this.date_of_birth = reader.date_of_birth;
        this.gender = reader.gender;
        this.email = reader.email;
        this.phone = reader.phone;
        this.address = reader.address;
    }
}