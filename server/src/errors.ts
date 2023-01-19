import { NextFunction, Request, Response } from 'express';

export class AppError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.name = 'AppError';
		this.statusCode = statusCode;
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 400);
		this.name = 'ValidationError';
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
	if (err instanceof AppError) {
		res.status(err.statusCode).json({
			error: `${err.message}`
		});
		return;
	}
	console.log(err.message);
	res.status(500).json({
		error: 'Unexpected error: ' + err
	});
};

export const unknownEndpoint = (_req: Request, res: Response) => {
	res.status(404).send({ error: 'Unknown endpoint' });
};
