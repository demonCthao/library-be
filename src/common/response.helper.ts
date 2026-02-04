import { Response } from "express";

class AppError extends Error {
    statusCode: number;
    errorCode: string;
    errors?: any[];

    constructor(
        message: string,
        errorCode: string,
        statusCode = 400,
        errors?: any[]
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.errors = errors;
    }
}

interface ListResponse<T> {
    total: number;
    list: T[];
}

function sendSuccess<T>(
    res: Response,
    list: T[],
    total: number,
    message = "Success"
) {
    return res.status(200).json({
        success: true,
        message,
        data: {
            total,
            list,
        } as ListResponse<T>,
    });
}

function sendError(
    res: Response,
    err: AppError
) {
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errorCode: err.errorCode,
        errors: err.errors ?? [],
    });
}

export { sendSuccess, sendError }