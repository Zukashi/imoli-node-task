// validationMiddleware.ts

import { plainToInstance} from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validationMiddleware<T extends object>(type: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const input = plainToInstance(type, req.body);
        const errors = await validate(input, {
            whitelist: true, // ensures that only properties decorated with class-validator decorators are allowed
            forbidNonWhitelisted: true, // rejects request if it contains non-whitelisted properties
        });

        if (errors.length > 0) {
            const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
            return res.status(400).json({ error: message });
        }

        next();
    };
}