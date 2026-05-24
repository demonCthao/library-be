import { HttpException } from "./http.exception";

export class BadRequestException extends HttpException {
    constructor(message = 'Bad Request', errors?: any) {
        super(400, message, errors);
    }
}

export class InternalServerErrorException extends HttpException {
    constructor(message = 'Internal Server Error', errors?: any) {
        super(500, message, errors);
    }
}

export class NotFoundException extends HttpException {
    constructor(message = 'Not Found') {
        super(404, message);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}

export class AlreadyExistsException extends HttpException {
    constructor(resource = 'Resource') {
        super(409, `${resource} đã tồn tại`);
    }
}

export class ForbiddenException extends HttpException {
    constructor(message = 'Forbidden') {
        super(403, `${message}`);
    }
}