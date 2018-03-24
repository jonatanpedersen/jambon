import { HttpStatusCodes } from './HttpStatusCodes';

export class HttpError extends Error {
	statusCode : HttpStatusCodes

	constructor (statusCode : HttpStatusCodes, message : string) {
		super(message);
		this.statusCode = statusCode;
	}
}

export class NotFoundHttpError extends HttpError {
	constructor (message : string) {
		super(HttpStatusCodes.NOT_FOUND, message);
	}
}

export class BadRequestHttpError extends HttpError {
	constructor (message : string) {
		super(HttpStatusCodes.BAD_REQUEST, message);
	}
}

export class InternalServerErrorHttpError extends HttpError {
	constructor (message : string) {
		super(HttpStatusCodes.INTERNAL_SERVER_ERROR, message);
	}
}